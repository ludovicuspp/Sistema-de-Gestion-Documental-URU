using Scalar.AspNetCore;
using Sidae.Commons.DataAccess;
using Sidae.Commons.Extensions;
using Sidae.Commons.Middlewares;
using Sidae.Documents.Extensions;
using Sidae.Documents.OpenApi;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi(options => options.AddDocumentTransformer<BearerSecuritySchemeTransformer>());

builder.Services.AddControllers();
builder.Services.AddSidaeJwtAuthentication(builder.Configuration);
builder.Services.AddSidaeCommonsApplicationServices();
builder.Services.AddBusinessRateLimiting(builder.Configuration);
builder.Services.AddSidaeRateLimiting(builder.Configuration);
//builder.Services.AddCloudflareR2Storage(builder.Configuration);
builder.Services.AddAppDbContext(builder.Configuration.GetAppDatabaseSection(), builder.Environment);

builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>("database");

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("/swagger", options =>
    {
        options.WithOpenApiRoutePattern("/openapi/v1.json");
    });
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseMiddleware<RequestTraceMiddleware>();
app.UseSidaeRequestGuards();
app.UseAuthorization();
app.MapControllers().RequireRateLimiting(RateLimitPolicies.PerIp);
app.MapHealthChecks("/health");

app.Run();

public partial class Program;
