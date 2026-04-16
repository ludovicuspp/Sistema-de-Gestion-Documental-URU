namespace Sidae.Commons.Entities;

/// <summary>
/// Rol de aplicación — <c>Security.Role</c>.
/// </summary>
public sealed class Role
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Name { get; set; } = string.Empty;
}
