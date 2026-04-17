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
    public DbSet<AcademicLevel> AcademicLevels => Set<AcademicLevel>();
    public DbSet<Career> Careers => Set<Career>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Person> Persons => Set<Person>();

    public DbSet<RecordFolderStatus> RecordFolderStatuses => Set<RecordFolderStatus>();
    public DbSet<RecordFolderType> RecordFolderTypes => Set<RecordFolderType>();
    public DbSet<RecordPhysicalLocation> RecordPhysicalLocations => Set<RecordPhysicalLocation>();
    public DbSet<RecordFolder> RecordFolders => Set<RecordFolder>();
    public DbSet<RecordObservation> RecordObservations => Set<RecordObservation>();
    public DbSet<RequestStatus> RequestStatuses => Set<RequestStatus>();
    public DbSet<RequestItem> RequestItems => Set<RequestItem>();
    public DbSet<RequestDocumentType> RequestDocumentTypes => Set<RequestDocumentType>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new DocumentTypeConfiguration());
        modelBuilder.ApplyConfiguration(new AcademicLevelConfiguration());
        modelBuilder.ApplyConfiguration(new CareerConfiguration());
        modelBuilder.ApplyConfiguration(new RoleConfiguration());
        modelBuilder.ApplyConfiguration(new PersonConfiguration());
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new RecordFolderStatusConfiguration());
        modelBuilder.ApplyConfiguration(new RecordFolderTypeConfiguration());
        modelBuilder.ApplyConfiguration(new RecordPhysicalLocationConfiguration());
        modelBuilder.ApplyConfiguration(new RecordFolderConfiguration());
        modelBuilder.ApplyConfiguration(new RecordObservationConfiguration());
        modelBuilder.ApplyConfiguration(new RequestStatusConfiguration());
        modelBuilder.ApplyConfiguration(new RequestItemConfiguration());
        modelBuilder.ApplyConfiguration(new RequestDocumentTypeConfiguration());
    }
}
