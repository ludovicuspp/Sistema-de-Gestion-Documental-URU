namespace Sidae.Commons.Interfaces;

/// <summary>
/// Usuario de la petición HTTP (opcional). Para auditoría CreatedBy/UpdatedBy.
/// </summary>
public interface ICurrentUserAccessor
{
    string? GetUserId();

    string? GetPrimaryEmail();

    /// <summary>Identificador de persona para auditoría; null si no aplica.</summary>
    int? GetCurrentPersonId();
}
