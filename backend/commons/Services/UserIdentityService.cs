namespace Sidae.Commons.Services;

using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Models;

public sealed class UserIdentityService : IUserIdentityService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserIdentityService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
    }

    public UserIdentity GetCurrent()
    {
        var user = _httpContextAccessor.HttpContext?.User;
        if (user is null || user.Identity?.IsAuthenticated != true)
            return new UserIdentity(null, null, null, null);

        static string? Claim(ClaimsPrincipal principal, params string[] keys)
        {
            foreach (var key in keys)
            {
                var value = principal.FindFirstValue(key);
                if (!string.IsNullOrWhiteSpace(value))
                    return value;
            }

            return null;
        }

        var personIdRaw = Claim(user, "person_id", "personId", ClaimTypes.Sid);
        int? personId = int.TryParse(personIdRaw, out var parsed) ? parsed : null;

        return new UserIdentity(
            Claim(user, ClaimTypes.NameIdentifier, "sub"),
            Claim(user, ClaimTypes.Email, "email", "upn", "preferred_username"),
            Claim(user, "plan"),
            personId);
    }
}
