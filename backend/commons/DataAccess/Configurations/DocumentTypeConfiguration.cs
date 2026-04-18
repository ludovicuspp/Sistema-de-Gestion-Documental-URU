namespace Sidae.Commons.DataAccess.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sidae.Commons.Entities;

public sealed class DocumentTypeConfiguration : IEntityTypeConfiguration<DocumentType>
{
    public void Configure(EntityTypeBuilder<DocumentType> builder)
    {
        builder.ToTable("Type", "Document");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedOnAdd();

        builder.Property(e => e.GuidId).IsRequired();
        builder.HasIndex(e => e.GuidId).IsUnique();

        builder.Property(e => e.Name).HasColumnName("Name").HasMaxLength(100).IsRequired();
        builder.Property(e => e.IsRequired).HasColumnName("IsRequired").IsRequired();
    }
}
