namespace Sidae.Commons.Entities;

/// <summary>
/// Datos personales — <c>Person.Person</c>. No forma parte del registro mínimo por email/contraseña
/// (exige CI, nombres, etc.); se completa en otro flujo y se enlaza con <see cref="UserId"/>.
/// </summary>
public sealed class Person
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string CI { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }

    public DateOnly? Birthdate { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool Active { get; set; } = true;

    public int? GenderId { get; set; }

    public int? UserId { get; set; }

    public int? CreatedById { get; set; }

    public int? UpdatedById { get; set; }

    public User? User { get; set; }
}
