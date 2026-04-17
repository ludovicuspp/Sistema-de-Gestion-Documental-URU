namespace Sidae.Commons.DataAccess.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sidae.Commons.Entities;

public sealed class RecordFolderTypeConfiguration : IEntityTypeConfiguration<RecordFolderType>
{
    public void Configure(EntityTypeBuilder<RecordFolderType> builder)
    {
        builder.ToTable("FolderType", "Record");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedOnAdd();
        builder.Property(e => e.GuidId).IsRequired();
        builder.HasIndex(e => e.GuidId).IsUnique();
        builder.Property(e => e.Name).HasMaxLength(40).IsRequired();
    }
}
