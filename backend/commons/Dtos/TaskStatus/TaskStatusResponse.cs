namespace Sidae.Commons.Dtos.TaskStatus;

public sealed class TaskStatusResponse
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Name { get; set; } = string.Empty;
}
