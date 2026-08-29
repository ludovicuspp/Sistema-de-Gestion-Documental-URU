namespace Sidae.Tests;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Moq;
using Sidae.Authentication.Services;
using Sidae.Commons.Entities;

public sealed class TokenServiceTests
{
    private static IConfiguration CreateJwtConfiguration(
        string expiryMinutes = "90",
        string? issuer = "test-issuer",
        string? audience = "test-audience")
    {
        var jwtSection = new Mock<IConfigurationSection>();
        jwtSection.Setup(s => s["Key"]).Returns(new string('k', 64));
        jwtSection.Setup(s => s["Issuer"]).Returns(issuer);
        jwtSection.Setup(s => s["Audience"]).Returns(audience);
        jwtSection.Setup(s => s["ExpiryMinutes"]).Returns(expiryMinutes);

        var config = new Mock<IConfiguration>();
        config.Setup(c => c.GetSection("Jwt")).Returns(jwtSection.Object);
        return config.Object;
    }

    [Fact]
    public void Generate_ReturnsNonEmptyJwt_WithExpectedClaims_WhenUserHasRole()
    {
        var user = new User
        {
            Id = 42,
            Email = "user@example.com",
            Username = "jdoe",
            Role = new Role { Name = "Usuario" }
        };

        var sut = new TokenService(CreateJwtConfiguration());
        var token = sut.Generate(user);

        Assert.False(string.IsNullOrWhiteSpace(token));

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
        Assert.Equal("42", jwt.Payload[JwtRegisteredClaimNames.Sub]?.ToString());
        Assert.Equal("42", jwt.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
        Assert.Equal("user@example.com", jwt.Claims.First(c => c.Type == ClaimTypes.Email).Value);
        Assert.Equal("Usuario", jwt.Claims.First(c => c.Type == ClaimTypes.Role).Value);
        Assert.Equal("test-issuer", jwt.Issuer);
        Assert.Contains("test-audience", jwt.Audiences);
    }

    [Fact]
    public void Generate_IncludesNoRoleClaims_WhenRoleNameMissing()
    {
        var user = new User
        {
            Id = 7,
            Email = "norole@example.com",
            Username = "solo",
            Role = null
        };

        var sut = new TokenService(CreateJwtConfiguration());
        var token = sut.Generate(user);

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
        Assert.DoesNotContain(jwt.Claims, c => c.Type == ClaimTypes.Role);
    }

    [Fact]
    public void Generate_UsesDefaultExpiry_WhenExpiryMinutesInvalid()
    {
        var user = new User { Id = 1, Email = "a@b.c", Username = "u" };
        var sut = new TokenService(CreateJwtConfiguration(expiryMinutes: "not-a-number"));
        var token = sut.Generate(user);

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
        var expected = DateTime.UtcNow.AddMinutes(120);
        Assert.InRange(jwt.ValidTo, expected.AddMinutes(-2), expected.AddMinutes(2));
    }
}
