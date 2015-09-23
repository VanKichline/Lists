using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;


namespace Lists.Models {
    public class InMemoryRepository : IRepository {
        private List<Item> _items = new List<Item>();
        private int _nextIndex = 0;

        public InMemoryRepository() {
            UseDefaultData();
        }

        public IEnumerable<Item> getAll() {
            return _items;
        }

        public int count() {
            return _items.Count;
        }

        public Item get(int id) {
            Item result = null;
            foreach(Item item in _items) {
                if(item.ID == id) {
                    result = item;
                    break;
                }
            }
            return result;
        }

        // index is replaced
        public void add(Item item) {
            item.ID = _nextIndex++;
            _items.Add(item);
        }

        public bool update(Item item) {
            if (!delete(item.ID)) return false;
            add(item);
            return true;
        }

        public bool delete(int id) {
            Item item = get(id);
            if (null == item) return false;
            return _items.Remove(item);
        }

        private void UseDefaultData() {
            Debug.Assert(_items.Count == 0);
            _items.Add(new Item { ID = 1, Done = false, UserName = "Van", ItemText = "Bread", ListName = "Shopping" });
            _items.Add(new Item { ID = 2, Done = false, UserName = "Van", ItemText = "Butter", ListName = "Shopping" });
            _items.Add(new Item { ID = 3, Done = false, UserName = "Van", ItemText = "Cheese", ListName = "Shopping" });
            _items.Add(new Item { ID = 4, Done = false, UserName = "Van", ItemText = "Shirts", ListName = "Packing" });
            _items.Add(new Item { ID = 5, Done = false, UserName = "Van", ItemText = "Pants", ListName = "Packing" });
            _items.Add(new Item { ID = 6, Done = false, UserName = "Van", ItemText = "Socks", ListName = "Packing" });
            _items.Add(new Item { ID = 7, Done = false, UserName = "Van", ItemText = "Shoes", ListName = "Packing" });
            _items.Add(new Item { ID = 8, Done = false, UserName = "Joey", ItemText = "Homework", ListName = "School" });
            _nextIndex = 9;
        }

    }
}
