namespace Sidae.Commons.DataAccess.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sidae.Commons.Entities;

public sealed class MimeTypeConfiguration : IEntityTypeConfiguration<MimeType>
{
    public void Configure(EntityTypeBuilder<MimeType> builder)
    {
        builder.ToTable("MimeType", "Document");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedOnAdd();

        builder.Property(e => e.GuidId).IsRequired();
        builder.HasIndex(e => e.GuidId).IsUnique();

        builder.Property(e => e.Name).HasMaxLength(100).IsRequired();
    }
}
