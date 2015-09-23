using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lists.Models {
    public interface IRepository {
        IEnumerable<Item> getAll();
        int count();
        Item get(int id);
        void add(Item item); // index is replaced
        bool update(Item item);
        bool delete(int id);
    }
}
