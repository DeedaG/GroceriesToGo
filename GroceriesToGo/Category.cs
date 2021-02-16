using System;
using System.Collections.Generic;

namespace GroceriesToGo
{
    public class Category
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public string CatName { get; set; }

        public List<Item> Items { get; set; }
    }
}
