namespace Sidae.Commons.Entities;

/// <summary>Task.Status</summary>
public sealed class TaskStatus
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Name { get; set; } = string.Empty;
}
