namespace Sidae.Commons.DataAccess;

using Microsoft.EntityFrameworkCore;
using Sidae.Commons.DataAccess.Configurations;
using Sidae.Commons.Entities;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<DocumentType> DocumentTypes => Set<DocumentType>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new DocumentTypeConfiguration());
    }
}
