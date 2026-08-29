namespace Sidae.Commons.Dtos.SecurityRole;

public sealed class SecurityRoleResponse
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Name { get; set; } = string.Empty;
}
