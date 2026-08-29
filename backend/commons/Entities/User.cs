namespace Sidae.Commons.Entities;

/// <summary>
/// Credenciales y rol — mapea <c>Security.User</c> (PostgreSQL).
/// El perfil descriptivo va en <see cref="Person"/> (<c>Person.Person</c>), opcionalmente enlazado por <see cref="Person.UserId"/>.
/// </summary>
public sealed class User
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Username { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public int RoleId { get; set; }

    public Role? Role { get; set; }
}
