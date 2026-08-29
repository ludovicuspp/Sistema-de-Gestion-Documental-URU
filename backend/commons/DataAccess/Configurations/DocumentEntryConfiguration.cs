namespace Sidae.Commons.DataAccess.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sidae.Commons.Entities;

public sealed class DocumentEntryConfiguration : IEntityTypeConfiguration<DocumentEntry>
{
    public void Configure(EntityTypeBuilder<DocumentEntry> builder)
    {
        builder.ToTable("Document", "Document");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedOnAdd();

        builder.Property(e => e.GuidId).IsRequired();
        builder.HasIndex(e => e.GuidId).IsUnique();

        builder.Property(e => e.Url).HasMaxLength(400).IsRequired();
        builder.Property(e => e.Name).HasMaxLength(100).IsRequired();
        builder.Property(e => e.CreatedAt).IsRequired();
        builder.Property(e => e.Active).IsRequired();

        builder.Property(e => e.FolderId).IsRequired();

        builder.HasOne<RecordFolder>()
            .WithMany()
            .HasForeignKey(e => e.FolderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<MimeType>()
            .WithMany()
            .HasForeignKey(e => e.MimeTypeId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne<DocumentType>()
            .WithMany()
            .HasForeignKey(e => e.DocumentTypeId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.CreatedById)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.UpdatedById)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
