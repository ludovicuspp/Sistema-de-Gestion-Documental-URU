namespace Sidae.Commons.Entities;

/// <summary>Security.Action (verbo HTTP u operación).</summary>
public sealed class SecurityAction
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Name { get; set; } = string.Empty;
}
