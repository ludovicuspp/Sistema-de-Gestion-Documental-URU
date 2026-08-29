namespace Sidae.Commons.Interfaces;

using Sidae.Commons.Models;

public interface IUserIdentityService
{
    UserIdentity GetCurrent();
}
