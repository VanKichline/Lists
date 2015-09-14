using System.ComponentModel.DataAnnotations;
using Microsoft.Data.Entity.Metadata;

namespace Lists.Models
{
    public class Item
    {
        public int ID { get; set; }
        public string UserName { get; set; }
        public string ListName { get; set; }
        public string ItemText { get; set; }
        public bool Done { get; set; }
    }
}
