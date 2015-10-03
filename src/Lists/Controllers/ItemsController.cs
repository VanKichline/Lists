using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Lists.Models;
using Microsoft.Data.Entity;

namespace Lists.Controllers
{
    [Route("api/[controller]")]
    public class ItemsController : Controller
    {
        private ItemContext _context;

        public ItemsController(ItemContext context)
        {
            _context = context;
        }

        // GET: api/items
        [HttpGet]
        public IEnumerable<Item> Get()
        {
            return _context.Items.ToList();
        }

        // GET api/items/5
        // This route must be named for CreatedAtRoute call in Post below:
        [HttpGet("{id}", Name = "GetItem")]
        public IActionResult Get(int id)
        {
            var result = _context.Items.Where(item => item.ID == id);
            if(1 == result.Count()) {
                return new ObjectResult(result.First());
            }
            return HttpNotFound();
        }

        // POST api/items
        [HttpPost]
        public async Task<ActionResult> Post([FromBody]Item item) {
            if (null != item) {
                if (0 < _context.Items.Where(attempt => attempt.ID == item.ID).Count()) {
                    return HttpBadRequest();
                }
                _context.Items.Attach(item);
                _context.Entry(item).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return CreatedAtRoute("GetItem", new { controller = "Item", id = item.ID }, item);
            }
            else {
                return HttpBadRequest();
            }
        }

        // PUT api/items/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/items/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
