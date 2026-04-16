namespace Sidae.Authentication.Services;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Sidae.Commons.Entities;

public sealed class TokenService(IConfiguration configuration)
{
    public string Generate(User user)
    {
        var section = configuration.GetSection("Jwt");
        var key = section["Key"] ?? string.Empty;
        var issuer = section["Issuer"] ?? string.Empty;
        var audience = section["Audience"] ?? string.Empty;
        var expiryMinutes = int.TryParse(section["ExpiryMinutes"], out var minutes) ? minutes : 120;

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new("email", user.Email)
        };

        if (!string.IsNullOrWhiteSpace(user.FullName))
        {
            claims.Add(new Claim(ClaimTypes.Name, user.FullName));
            claims.Add(new Claim("name", user.FullName));
        }

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
