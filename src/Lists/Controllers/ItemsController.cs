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
        // Do NOT include ID attribute in POSTed Item object
        [HttpPost]
        public IActionResult Post([FromBody]Item item) {
            if (null != item) {
                _context.Items.Add(item);
                _context.SaveChanges();
                return CreatedAtRoute("GetItem", new { controller = "Item", id = item.ID }, item);
            }
            else {
                return HttpBadRequest();
            }
        }

        // PUT api/items/5
        // Item object may or may not include ID, but ID param will be used rather than item.ID.
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody]Item item)
        {
            if(null != item) {
                Item orig = null;
                var result = _context.Items.Where(x => x.ID == id);
                if (result.Count() > 0) {
                    orig = result.First();
                }
                if(null != orig) {
                    orig.ItemText = item.ItemText;
                    orig.Done = item.Done;
                    _context.Items.Update(orig);
                    _context.SaveChanges();
                    return new NoContentResult();
                }
                else {
                    return HttpNotFound();
                }
            }
            else {
                return HttpBadRequest();
            }
        }

        // DELETE api/items/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _context.Items.Where(x => x.ID == id);
            if (result.Count() > 0) {
                Item item = result.First();
                _context.Items.Remove(item);
                _context.SaveChanges();
                return new NoContentResult();
            }
            return HttpNotFound();
        }
    }
}
