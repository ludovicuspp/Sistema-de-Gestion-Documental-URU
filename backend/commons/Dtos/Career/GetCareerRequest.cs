namespace Sidae.Commons.Dtos.Career;

public sealed class GetCareerRequest
{
    public int? Id { get; set; }

    public Guid? GuidId { get; set; }

    public string? Name { get; set; }
}
