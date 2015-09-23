using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Lists.Models;

namespace Lists.Controllers {
    [Route("api/[controller]")]
    public class ItemsController : Controller {
        private ItemContext _context;

        public ItemsController(ItemContext context) {
            //_context = context;
        }

        // GET: api/values
        [HttpGet]
        public IEnumerable<Item> Get() {
            //return _context.Items.ToList();
            var list = new List<Item>();
            list.Add(new Item { Done = false, UserName = "Van", ItemText = "Bread", ListName = "Shopping" });
            list.Add(new Item { Done = false, UserName = "Van", ItemText = "Butter", ListName = "Shopping" });
            list.Add(new Item { Done = false, UserName = "Van", ItemText = "Cheese", ListName = "Shopping" });
            list.Add(new Item { Done = false, UserName = "Van", ItemText = "Shirts", ListName = "Packing" });
            list.Add(new Item { Done = false, UserName = "Van", ItemText = "Pants", ListName = "Packing" });
            list.Add(new Item { Done = false, UserName = "Van", ItemText = "Socks", ListName = "Packing" });
            list.Add(new Item { Done = false, UserName = "Van", ItemText = "Shoes", ListName = "Packing" });
            list.Add(new Item { Done = false, UserName = "Joey", ItemText = "Homework", ListName = "School" });
            return list;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public Item Get(int id) {
            return _context.Items.ElementAt(id);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value) {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value) {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id) {
        }
    }
}
