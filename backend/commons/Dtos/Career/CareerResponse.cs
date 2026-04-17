namespace Sidae.Commons.Dtos.Career;

public sealed class CareerResponse
{
    public int Id { get; set; }

    public Guid GuidId { get; set; }

    public string Description { get; set; } = string.Empty;
}
