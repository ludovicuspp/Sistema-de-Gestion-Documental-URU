namespace Sidae.Authentication.Controllers;

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sidae.Authentication.Services;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Entities;
using Sidae.Commons.Patterns;

[ApiController]
[Route("api/v1/auth")]
public sealed class AuthController(
    AppDbContext dbContext,
    TokenService tokenService,
    IConfiguration configuration) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("register")]
    [ProducesResponseType(typeof(Result<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Result<AuthResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(Result<AuthResponse>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        if (normalizedEmail.Length > 60)
            return BadRequest(Result<AuthResponse>.Failure(new Error("VALIDATION", "El email supera el maximo permitido (60 caracteres).")));

        var existingUser = await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(user => user.Email == normalizedEmail, cancellationToken)
            .ConfigureAwait(false);

        if (existingUser is not null)
            return BadRequest(Result<AuthResponse>.Failure(new Error("ALREADY_EXISTS", "El email ya se encuentra registrado.")));

        var defaultRoleName = configuration["Auth:DefaultRegisterRoleName"] ?? "Usuario";
        var role = await dbContext.Roles
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Name == defaultRoleName, cancellationToken)
            .ConfigureAwait(false);

        if (role is null)
            return StatusCode(StatusCodes.Status500InternalServerError,
                Result<AuthResponse>.Failure(new Error(
                    "CONFIGURATION",
                    $"No existe el rol '{defaultRoleName}'. Ejecute la migracion de datos estaticos (SeedData).")));

        var username = string.IsNullOrWhiteSpace(request.Username)
            ? normalizedEmail
            : request.Username.Trim();
        if (username.Length > 100)
            username = username[..100];

        var user = new User
        {
            GuidId = Guid.NewGuid(),
            Username = username,
            Email = normalizedEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            IsActive = true,
            RoleId = role.Id
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        var created = await dbContext.Users
            .AsNoTracking()
            .Include(u => u.Role)
            .FirstAsync(u => u.Id == user.Id, cancellationToken)
            .ConfigureAwait(false);

        var token = tokenService.Generate(created);
        return Ok(Result<AuthResponse>.Success(new AuthResponse(token, created.Email, created.Username, created.Role?.Name ?? role.Name)));
    }

    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(typeof(Result<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Result<AuthResponse>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await dbContext.Users
            .Include(u => u.Role)
            .AsNoTracking()
            .FirstOrDefaultAsync(dbUser => dbUser.Email == normalizedEmail, cancellationToken)
            .ConfigureAwait(false);

        if (user is null || !user.IsActive)
            return Unauthorized(Result<AuthResponse>.Failure(new Error("UNAUTHORIZED", "Credenciales invalidas.")));

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isPasswordValid)
            return Unauthorized(Result<AuthResponse>.Failure(new Error("UNAUTHORIZED", "Credenciales invalidas.")));

        var token = tokenService.Generate(user);
        return Ok(Result<AuthResponse>.Success(new AuthResponse(token, user.Email, user.Username, user.Role?.Name ?? string.Empty)));
    }

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(Result<MeResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Result<MeResponse>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
    {
        var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (!int.TryParse(idClaim, out var userId))
            return Unauthorized(Result<MeResponse>.Failure(new Error("UNAUTHORIZED", "Token invalido.")));

        var user = await dbContext.Users
            .AsNoTracking()
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken)
            .ConfigureAwait(false);

        if (user is null || !user.IsActive)
            return Unauthorized(Result<MeResponse>.Failure(new Error("UNAUTHORIZED", "Usuario no autorizado.")));

        var person = await dbContext.Persons
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken)
            .ConfigureAwait(false);

        return Ok(Result<MeResponse>.Success(new MeResponse(
            user.Id.ToString(),
            user.Email,
            user.Username,
            user.Role?.Name ?? string.Empty,
            user.IsActive,
            person?.FirstName,
            person?.LastName)));
    }

    /// <param name="Username">Opcional; por defecto se usa el email. <c>Security.User.Username</c>.</param>
    public sealed record RegisterRequest(string Email, string Password, string? Username);

    public sealed record LoginRequest(string Email, string Password);

    public sealed record AuthResponse(string Token, string Email, string Username, string Role);

    public sealed record MeResponse(
        string UserId,
        string Email,
        string Username,
        string Role,
        bool IsActive,
        string? PersonFirstName,
        string? PersonLastName);
}
