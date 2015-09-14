using Microsoft.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lists.Models
{
    public class ItemContext : DbContext
    {
        public DbSet<Item> Items { get; set; }
    }
}
