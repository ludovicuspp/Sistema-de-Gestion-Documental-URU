namespace Sidae.Tests;

using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using Sidae.Authentication.Controllers;
using Sidae.Authentication.Services;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Entities;
using Sidae.Commons.Patterns;

public sealed class AuthControllerTests
{
    private static (AppDbContext Db, IConfiguration Config, TokenService TokenService) CreateFixture(string? defaultRoleName = "Usuario")
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var db = new AppDbContext(options);

        db.Roles.Add(new Role { Id = 1, GuidId = Guid.NewGuid(), Name = "Usuario" });
        db.SaveChanges();

        var jwtSection = new Mock<IConfigurationSection>();
        jwtSection.Setup(s => s["Key"]).Returns(new string('k', 64));
        jwtSection.Setup(s => s["Issuer"]).Returns("test-issuer");
        jwtSection.Setup(s => s["Audience"]).Returns("test-audience");
        jwtSection.Setup(s => s["ExpiryMinutes"]).Returns("60");

        var config = new Mock<IConfiguration>();
        config.Setup(c => c.GetSection("Jwt")).Returns(jwtSection.Object);
        if (defaultRoleName is not null)
            config.Setup(c => c["Auth:DefaultRegisterRoleName"]).Returns(defaultRoleName);

        var cfg = config.Object;
        var tokenService = new TokenService(cfg);
        return (db, cfg, tokenService);
    }

    private static AuthController CreateController(AppDbContext db, IConfiguration config, TokenService tokenService, ClaimsPrincipal? user = null)
    {
        var controller = new AuthController(db, tokenService, config);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user ?? new ClaimsPrincipal() }
        };
        return controller;
    }

    [Fact]
    public async Task Register_ReturnsOk_WithToken_WhenEmailIsNew()
    {
        var (db, config, tokenService) = CreateFixture();
        var sut = CreateController(db, config, tokenService);

        var result = await sut.Register(new AuthController.RegisterRequest("New@Example.com", "Secret1!", null), CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result);
        var body = Assert.IsType<Result<AuthController.AuthResponse>>(ok.Value);
        Assert.True(body.Ok);
        Assert.NotNull(body.Response);
        Assert.Equal("new@example.com", body.Response.Email);
        Assert.False(string.IsNullOrEmpty(body.Response.Token));
        Assert.Equal("Usuario", body.Response.Role);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_ALREADY_EXISTS_WhenEmailAlreadyRegistered()
    {
        var (db, config, tokenService) = CreateFixture();
        var sut = CreateController(db, config, tokenService);

        await sut.Register(new AuthController.RegisterRequest("dup@example.com", "p", null), CancellationToken.None);
        var result = await sut.Register(new AuthController.RegisterRequest("DUP@EXAMPLE.COM ", "p2", null), CancellationToken.None);

        var bad = Assert.IsType<BadRequestObjectResult>(result);
        var body = Assert.IsType<Result<AuthController.AuthResponse>>(bad.Value);
        Assert.False(body.Ok);
        Assert.Equal("ALREADY_EXISTS", body.Error?.Code);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_VALIDATION_WhenEmailExceeds60Characters()
    {
        var (db, config, tokenService) = CreateFixture();
        var sut = CreateController(db, config, tokenService);

        var longLocal = new string('a', 56);
        var email = $"{longLocal}@x.co";

        var result = await sut.Register(new AuthController.RegisterRequest(email, "p", null), CancellationToken.None);

        var bad = Assert.IsType<BadRequestObjectResult>(result);
        var body = Assert.IsType<Result<AuthController.AuthResponse>>(bad.Value);
        Assert.False(body.Ok);
        Assert.Equal("VALIDATION", body.Error?.Code);
    }

    [Fact]
    public async Task Register_Returns500_WhenDefaultRoleDoesNotExist()
    {
        var (db, config, tokenService) = CreateFixture(defaultRoleName: "MissingRole");

        var result = await CreateController(db, config, tokenService)
            .Register(new AuthController.RegisterRequest("a@b.co", "p", null), CancellationToken.None);

        var obj = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status500InternalServerError, obj.StatusCode);
        var body = Assert.IsType<Result<AuthController.AuthResponse>>(obj.Value);
        Assert.False(body.Ok);
        Assert.Equal("CONFIGURATION", body.Error?.Code);
    }

    [Fact]
    public async Task Login_ReturnsOk_WhenCredentialsAreValid()
    {
        var (db, config, tokenService) = CreateFixture();
        await CreateController(db, config, tokenService)
            .Register(new AuthController.RegisterRequest("login@example.com", "GoodPass1!", null), CancellationToken.None);

        var result = await CreateController(db, config, tokenService)
            .Login(new AuthController.LoginRequest("login@example.com", "GoodPass1!"), CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result);
        var body = Assert.IsType<Result<AuthController.AuthResponse>>(ok.Value);
        Assert.True(body.Ok);
        Assert.NotNull(body.Response?.Token);
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_WhenPasswordWrong()
    {
        var (db, config, tokenService) = CreateFixture();
        await CreateController(db, config, tokenService)
            .Register(new AuthController.RegisterRequest("u@example.com", "right", null), CancellationToken.None);

        var result = await CreateController(db, config, tokenService)
            .Login(new AuthController.LoginRequest("u@example.com", "wrong"), CancellationToken.None);

        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
        var body = Assert.IsType<Result<AuthController.AuthResponse>>(unauthorized.Value);
        Assert.False(body.Ok);
        Assert.Equal("UNAUTHORIZED", body.Error?.Code);
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_WhenUserInactive()
    {
        var (db, config, tokenService) = CreateFixture();
        db.Users.Add(new User
        {
            GuidId = Guid.NewGuid(),
            Email = "inactive@example.com",
            Username = "in",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("p"),
            IsActive = false,
            RoleId = 1
        });
        await db.SaveChangesAsync();

        var result = await CreateController(db, config, tokenService)
            .Login(new AuthController.LoginRequest("inactive@example.com", "p"), CancellationToken.None);

        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
        var body = Assert.IsType<Result<AuthController.AuthResponse>>(unauthorized.Value);
        Assert.False(body.Ok);
    }

    [Fact]
    public async Task Me_ReturnsOk_WithProfile_WhenClaimIsNameIdentifier()
    {
        var (db, config, tokenService) = CreateFixture();
        var user = new User
        {
            GuidId = Guid.NewGuid(),
            Email = "me@example.com",
            Username = "meuser",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("x"),
            IsActive = true,
            RoleId = 1
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var id = user.Id;
        var principal = new ClaimsPrincipal(new ClaimsIdentity(
            [new Claim(ClaimTypes.NameIdentifier, id.ToString())],
            "Test"));

        var result = await CreateController(db, config, tokenService, principal)
            .Me(CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result);
        var body = Assert.IsType<Result<AuthController.MeResponse>>(ok.Value);
        Assert.True(body.Ok);
        Assert.Equal(id.ToString(), body.Response?.UserId);
        Assert.Equal("me@example.com", body.Response?.Email);
        Assert.Equal("Usuario", body.Response?.Role);
    }

    [Fact]
    public async Task Me_ReturnsOk_WhenClaimIsSubOnly()
    {
        var (db, config, tokenService) = CreateFixture();
        var user = new User
        {
            GuidId = Guid.NewGuid(),
            Email = "sub@example.com",
            Username = "s",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("x"),
            IsActive = true,
            RoleId = 1
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var principal = new ClaimsPrincipal(new ClaimsIdentity(
            [new Claim("sub", user.Id.ToString())],
            "Test"));

        var result = await CreateController(db, config, tokenService, principal).Me(CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result);
        var body = Assert.IsType<Result<AuthController.MeResponse>>(ok.Value);
        Assert.True(body.Ok);
        Assert.Equal(user.Id.ToString(), body.Response?.UserId);
    }

    [Fact]
    public async Task Me_ReturnsUnauthorized_WhenUserIdClaimMissingOrInvalid()
    {
        var (db, config, tokenService) = CreateFixture();
        var principal = new ClaimsPrincipal(new ClaimsIdentity(
            [new Claim(ClaimTypes.NameIdentifier, "not-an-int")],
            "Test"));

        var result = await CreateController(db, config, tokenService, principal).Me(CancellationToken.None);

        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
        var body = Assert.IsType<Result<AuthController.MeResponse>>(unauthorized.Value);
        Assert.False(body.Ok);
        Assert.Equal("UNAUTHORIZED", body.Error?.Code);
    }
}
