namespace Sidae.Commons.DataAccess.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sidae.Commons.Entities;

public sealed class RecordPhysicalLocationConfiguration : IEntityTypeConfiguration<RecordPhysicalLocation>
{
    public void Configure(EntityTypeBuilder<RecordPhysicalLocation> builder)
    {
        builder.ToTable("PhysicalLocation", "Record");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedOnAdd();
        builder.Property(e => e.GuidId).IsRequired();
        builder.HasIndex(e => e.GuidId).IsUnique();
        builder.Property(e => e.Shelf).HasMaxLength(50).IsRequired();
        builder.Property(e => e.Box).HasMaxLength(50).IsRequired();
        builder.Property(e => e.Row).HasMaxLength(100).IsRequired();
        builder.Property(e => e.Capacity);
    }
}
