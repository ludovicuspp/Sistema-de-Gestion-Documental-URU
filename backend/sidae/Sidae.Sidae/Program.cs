using Scalar.AspNetCore;
using global::Sidae.Commons.DataAccess;
using global::Sidae.Commons.Extensions;
using global::Sidae.Commons.Middlewares;
using global::Sidae.Sidae.Extensions;
using global::Sidae.Sidae.OpenApi;

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
