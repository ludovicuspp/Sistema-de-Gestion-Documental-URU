namespace Sidae.Authentication.Controllers;

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sidae.Authentication.Services;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Entities;

[ApiController]
[Route("api/v1/auth")]
public sealed class AuthController(AppDbContext dbContext, TokenService tokenService) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var existingUser = await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(user => user.Email == normalizedEmail, cancellationToken)
            .ConfigureAwait(false);

        if (existingUser is not null)
            return BadRequest(new { message = "El email ya se encuentra registrado." });

        var user = new User
        {
            GuidId = Guid.NewGuid(),
            Email = normalizedEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FullName = request.FullName?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        var token = tokenService.Generate(user);
        return Ok(new AuthResponse(token, user.Email, user.FullName));
    }

    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(dbUser => dbUser.Email == normalizedEmail, cancellationToken)
            .ConfigureAwait(false);

        if (user is null)
            return Unauthorized(new { message = "Credenciales invalidas." });

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isPasswordValid)
            return Unauthorized(new { message = "Credenciales invalidas." });

        var token = tokenService.Generate(user);
        return Ok(new AuthResponse(token, user.Email, user.FullName));
    }

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(MeResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        var email = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("email");
        var fullName = User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue("name");

        return Ok(new MeResponse(userId, email, fullName));
    }

    public sealed record RegisterRequest(string Email, string Password, string? FullName);
    public sealed record LoginRequest(string Email, string Password);
    public sealed record AuthResponse(string Token, string Email, string? FullName);
    public sealed record MeResponse(string? UserId, string? Email, string? FullName);
}
