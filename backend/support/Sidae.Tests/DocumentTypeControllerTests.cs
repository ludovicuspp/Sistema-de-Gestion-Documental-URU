namespace Sidae.Tests;

using Microsoft.AspNetCore.Mvc;
using Moq;
using Sidae.Commons.Dtos.DocumentType;
using Sidae.Commons.Interfaces;
using Sidae.Commons.Patterns;
using Sidae.Support.Controllers;

public sealed class DocumentTypeControllerTests
{
    private static DocumentTypeController CreateController(
        Mock<IDocumentTypeService> service,
        Mock<ICacheService>? cache = null)
    {
        cache ??= new Mock<ICacheService>();
        cache.Setup(c => c.Get<Result<List<DocumentTypeResponse>>>(It.IsAny<string>()))
            .Returns((Result<List<DocumentTypeResponse>>?)null);
        return new DocumentTypeController(service.Object, cache.Object);
    }

    [Fact]
    public async Task GetAll_Delegates_To_Service()
    {
        var mock = new Mock<IDocumentTypeService>();
        mock.Setup(s => s.GetAllAsync(It.IsAny<GetDocumentTypeRequest?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<List<DocumentTypeResponse>>.Success(new List<DocumentTypeResponse>()));

        var cacheMock = new Mock<ICacheService>();
        cacheMock.Setup(c => c.Get<Result<List<DocumentTypeResponse>>>(It.IsAny<string>()))
            .Returns((Result<List<DocumentTypeResponse>>?)null);

        var controller = new DocumentTypeController(mock.Object, cacheMock.Object);
        var result = await controller.GetAll(null, default);

        Assert.IsType<OkObjectResult>(result);
        mock.Verify(s => s.GetAllAsync(It.IsAny<GetDocumentTypeRequest?>(), It.IsAny<CancellationToken>()), Times.Once);
        cacheMock.Verify(
            c => c.Set(It.IsAny<string>(), It.IsAny<Result<List<DocumentTypeResponse>>>(), It.IsAny<TimeSpan?>()),
            Times.Once);
    }

    [Fact]
    public async Task GetById_Returns_NotFound_When_Service_Fails_NotFound()
    {
        var id = Guid.NewGuid();
        var mock = new Mock<IDocumentTypeService>();
        mock.Setup(s => s.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<DocumentTypeResponse>.Failure(new Error("NOT_FOUND", "x")));

        var controller = CreateController(mock);
        var result = await controller.GetById(id, default);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task Create_Posts_To_Service()
    {
        var mock = new Mock<IDocumentTypeService>();
        var dto = new CreateDocumentTypeRequest { Name = "A" };
        mock.Setup(s => s.CreateAsync(dto, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<DocumentTypeResponse>.Success(new DocumentTypeResponse { Id = 1, Name = "A", GuidId = Guid.NewGuid() }));

        var cacheMock = new Mock<ICacheService>();
        cacheMock.Setup(c => c.Get<Result<List<DocumentTypeResponse>>>(It.IsAny<string>()))
            .Returns((Result<List<DocumentTypeResponse>>?)null);

        var controller = new DocumentTypeController(mock.Object, cacheMock.Object);
        var result = await controller.Create(dto, default);

        Assert.IsType<OkObjectResult>(result);
        cacheMock.Verify(c => c.Remove(It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task Update_Puts_To_Service()
    {
        var guidId = Guid.NewGuid();
        var mock = new Mock<IDocumentTypeService>();
        var dto = new UpdateDocumentTypeRequest { Name = "B" };
        mock.Setup(s => s.UpdateAsync(guidId, dto, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<DocumentTypeResponse>.Success(new DocumentTypeResponse { Id = 2, Name = "B", GuidId = guidId }));

        var cacheMock = new Mock<ICacheService>();
        cacheMock.Setup(c => c.Get<Result<List<DocumentTypeResponse>>>(It.IsAny<string>()))
            .Returns((Result<List<DocumentTypeResponse>>?)null);

        var controller = new DocumentTypeController(mock.Object, cacheMock.Object);
        var result = await controller.Update(guidId, dto, default);

        Assert.IsType<OkObjectResult>(result);
        cacheMock.Verify(c => c.Remove(It.IsAny<string>()), Times.Once);
    }
}
