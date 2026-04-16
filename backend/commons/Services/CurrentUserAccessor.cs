namespace Sidae.Commons.Services;

using Sidae.Commons.Interfaces;

public sealed class CurrentUserAccessor : ICurrentUserAccessor
{
    private readonly IUserIdentityService _userIdentityService;

    public CurrentUserAccessor(IUserIdentityService userIdentityService)
    {
        _userIdentityService = userIdentityService ?? throw new ArgumentNullException(nameof(userIdentityService));
    }

    public string? GetUserId() => _userIdentityService.GetCurrent().UserId;

    public string? GetPrimaryEmail() => _userIdentityService.GetCurrent().Email;

    public int? GetCurrentPersonId() => _userIdentityService.GetCurrent().PersonId;
}
