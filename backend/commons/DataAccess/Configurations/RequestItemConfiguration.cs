namespace Sidae.Commons.DataAccess.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sidae.Commons.Entities;

public sealed class RequestItemConfiguration : IEntityTypeConfiguration<RequestItem>
{
    public void Configure(EntityTypeBuilder<RequestItem> builder)
    {
        builder.ToTable("Request", "Request");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedOnAdd();
        builder.Property(e => e.GuidId).IsRequired();
        builder.HasIndex(e => e.GuidId).IsUnique();
        builder.Property(e => e.EmailContact).HasMaxLength(100).IsRequired();
        builder.Property(e => e.TrackingCode).HasMaxLength(100);
        builder.Property(e => e.RequestAt).IsRequired();
        builder.Property(e => e.StudentId);
        builder.Property(e => e.StatusRequestId).IsRequired();
    }
}
