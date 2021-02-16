using System;
using System.Collections.Generic;

namespace GroceriesToGo
{
    public class Cart
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public string UserName { get; set; }

        public List<Item> Items { get; set; }
    }
}
