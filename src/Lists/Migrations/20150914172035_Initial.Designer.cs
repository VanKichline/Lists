using System;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Infrastructure;
using Microsoft.Data.Entity.Metadata;
using Microsoft.Data.Entity.Migrations;
using Lists.Models;
using Microsoft.Data.Entity.SqlServer.Metadata;

namespace Lists.Migrations
{
    [DbContext(typeof(ItemContext))]
    [Migration("20150914172035_Initial")]
    partial class Initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Annotation("ProductVersion", "7.0.0-beta8-15689")
                .Annotation("SqlServer:ValueGenerationStrategy", SqlServerIdentityStrategy.IdentityColumn);

            modelBuilder.Entity("Lists.Models.Item", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Done");

                    b.Property<string>("ItemText");

                    b.Property<string>("ListName");

                    b.Property<string>("UserName");

                    b.Key("ID");
                });
        }
    }
}
