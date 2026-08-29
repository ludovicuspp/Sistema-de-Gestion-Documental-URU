namespace Sidae.Commons.Dtos.TaskStatus;

public sealed class GetTaskStatusRequest
{
    public Guid? GuidId { get; set; }

    public string? Name { get; set; }
}
