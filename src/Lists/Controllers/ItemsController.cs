using Lists.Models;
using Microsoft.AspNet.Mvc;
using System.Collections.Generic;

namespace Lists.Controllers {
    [Route("api/[controller]")]
    public class ItemsController : Controller {
        private IRepository _context;

        public ItemsController() {
            _context = new InMemoryRepository();    // TODO: Use DI
        }

        // GET: api/values
        [HttpGet]
        public IEnumerable<Item> Get() {
            return _context.getAll();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public Item Get(int id) {
            return _context.get(id);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]Item item) {
            _context.update(item);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put([FromBody]Item item) {
            _context.add(item);
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id) {
            _context.delete(id);
        }
    }
}
