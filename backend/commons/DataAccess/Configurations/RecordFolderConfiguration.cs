namespace Sidae.Commons.DataAccess.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sidae.Commons.Entities;

public sealed class RecordFolderConfiguration : IEntityTypeConfiguration<RecordFolder>
{
    public void Configure(EntityTypeBuilder<RecordFolder> builder)
    {
        builder.ToTable("Folder", "Record");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedOnAdd();
        builder.Property(e => e.GuidId).IsRequired();
        builder.HasIndex(e => e.GuidId).IsUnique();
        builder.Property(e => e.Description).HasMaxLength(50);
        builder.Property(e => e.CreatedAt).IsRequired();
        builder.Property(e => e.StudentId).IsRequired();
        builder.Property(e => e.FolderStatusId).IsRequired();
        builder.Property(e => e.FolderTypeId).IsRequired();
        builder.Property(e => e.PhysicalLocationId);
        builder.Property(e => e.CreatedById);
    }
}
