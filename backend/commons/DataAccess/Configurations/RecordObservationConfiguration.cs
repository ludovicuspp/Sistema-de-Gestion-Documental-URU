namespace Sidae.Commons.DataAccess.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sidae.Commons.Entities;

public sealed class RecordObservationConfiguration : IEntityTypeConfiguration<RecordObservation>
{
    public void Configure(EntityTypeBuilder<RecordObservation> builder)
    {
        builder.ToTable("Observation", "Record");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedOnAdd();
        builder.Property(e => e.GuidId).IsRequired();
        builder.HasIndex(e => e.GuidId).IsUnique();
        builder.Property(e => e.Comment);
        builder.Property(e => e.CreatedAt).IsRequired();
        builder.Property(e => e.IsResolved).IsRequired();
        builder.Property(e => e.FolderId).IsRequired();
        builder.Property(e => e.DocumentId);
        builder.Property(e => e.AuthorId);
    }
}
