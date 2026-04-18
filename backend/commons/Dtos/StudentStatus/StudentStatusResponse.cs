namespace Sidae.Commons.Dtos.StudentStatus;

public sealed class StudentStatusResponse
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Name { get; set; } = string.Empty;
}
