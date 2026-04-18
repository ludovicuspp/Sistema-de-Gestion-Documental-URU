namespace Sidae.Tests;

using Microsoft.EntityFrameworkCore;
using global::Sidae.Commons.DataAccess;
using global::Sidae.Commons.Dtos.DocumentType;
using global::Sidae.Commons.Services;

public sealed class DocumentTypeServiceTests
{
    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"doc_types_{Guid.NewGuid():N}")
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task Create_GetById_Update_GetAll_RoundTrip()
    {
        await using var db = CreateContext();
        var service = new DocumentTypeService(db);

        var created = await service.CreateAsync(new CreateDocumentTypeRequest { Name = "Contrato" }, default);
        Assert.True(created.Ok);
        Assert.NotNull(created.Response);
        Assert.True(created.Response!.Id > 0);

        var byId = await service.GetByIdAsync(created.Response.GuidId, default);
        Assert.True(byId.Ok);
        Assert.Equal("Contrato", byId.Response!.Name);

        var updated = await service.UpdateAsync(created.Response.GuidId, new UpdateDocumentTypeRequest { Name = "Contrato v2" }, default);
        Assert.True(updated.Ok);
        Assert.Equal("Contrato v2", updated.Response!.Name);

        var all = await service.GetAllAsync(cancellationToken: default);
        Assert.True(all.Ok);
        Assert.Single(all.Response!);
    }

    [Fact]
    public async Task GetAll_Filters_By_Request_Properties()
    {
        await using var db = CreateContext();
        var service = new DocumentTypeService(db);

        var createdA = await service.CreateAsync(new CreateDocumentTypeRequest { Name = "Contrato" }, default);
        var createdB = await service.CreateAsync(new CreateDocumentTypeRequest { Name = "Factura" }, default);
        Assert.True(createdA.Ok);
        Assert.True(createdB.Ok);

        var byNombre = await service.GetAllAsync(new GetDocumentTypeRequest { Name = "Contr" }, default);
        Assert.True(byNombre.Ok);
        Assert.Single(byNombre.Response!);
        Assert.Equal("Contrato", byNombre.Response![0].Name);

        var byId = await service.GetAllAsync(new GetDocumentTypeRequest { GuidId = createdB.Response!.GuidId }, default);
        Assert.True(byId.Ok);
        Assert.Single(byId.Response!);
        Assert.Equal("Factura", byId.Response![0].Name);
    }

    [Fact]
    public async Task GetById_Returns_NotFound_WhenMissing()
    {
        await using var db = CreateContext();
        var service = new DocumentTypeService(db);

        var result = await service.GetByIdAsync(Guid.NewGuid(), default);
        Assert.False(result.Ok);
        Assert.Equal("NOT_FOUND", result.Error?.Code);
    }
}
