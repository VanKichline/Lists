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
    partial class Initial
    {
        public override string Id
        {
            get { return "20151003215443_Initial"; }
        }

        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Annotation("ProductVersion", "7.0.0-beta7-15540")
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
