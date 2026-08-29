namespace Sidae.Commons.DataAccess.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sidae.Commons.Entities;

public sealed class DocumentTypeAcademicLevelConfiguration : IEntityTypeConfiguration<DocumentTypeAcademicLevel>
{
    public void Configure(EntityTypeBuilder<DocumentTypeAcademicLevel> builder)
    {
        builder.ToTable("TypeAcademicLevel", "Document");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedOnAdd();

        builder.Property(e => e.GuidId).IsRequired();
        builder.HasIndex(e => e.GuidId).IsUnique();

        builder.Property(e => e.DocumentTypeId).IsRequired();
        builder.Property(e => e.AcademicLevelId).IsRequired();

        builder.HasIndex(e => new { e.DocumentTypeId, e.AcademicLevelId }).IsUnique();

        builder.HasOne(e => e.DocumentType)
            .WithMany(t => t.TypeAcademicLevels)
            .HasForeignKey(e => e.DocumentTypeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.AcademicLevel)
            .WithMany(a => a.DocumentTypeAcademicLevels)
            .HasForeignKey(e => e.AcademicLevelId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
