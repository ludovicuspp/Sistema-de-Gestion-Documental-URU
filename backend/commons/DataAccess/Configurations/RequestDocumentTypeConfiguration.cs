namespace Sidae.Commons.DataAccess.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sidae.Commons.Entities;

public sealed class RequestDocumentTypeConfiguration : IEntityTypeConfiguration<RequestDocumentType>
{
    public void Configure(EntityTypeBuilder<RequestDocumentType> builder)
    {
        builder.ToTable("DocumentType", "Request");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedOnAdd();
        builder.Property(e => e.GuidId).IsRequired();
        builder.HasIndex(e => e.GuidId).IsUnique();
        builder.Property(e => e.RequestId).IsRequired();
        builder.Property(e => e.DocumentTypeId).IsRequired();
    }
}
