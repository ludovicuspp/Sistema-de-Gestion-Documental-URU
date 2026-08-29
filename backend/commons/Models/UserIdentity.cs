namespace Sidae.Commons.Models;

public sealed record UserIdentity(
    string? UserId,
    string? Email,
    string? Plan,
    int? PersonId);
