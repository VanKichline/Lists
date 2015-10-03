using Microsoft.Data.Entity;

namespace Lists.Models {
    public class ItemContext : DbContext
    {
        public DbSet<Item> Items { get; set; }
    }
}
