using System;
namespace GroceriesToGo
{
    public class Item
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public string ItemName { get; set; }

        public string Category { get; set; }

        public int CategoryId { get; set; }

        public string Cart { get; set; }

        public int CartId { get; set; }
    }
}