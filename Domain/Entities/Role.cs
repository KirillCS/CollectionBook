using System.Collections.Generic;

namespace Domain.Entities
{
    public class Role
    {
        public Role()
        {
        }

        public Role(string name)
        {
            Name = name;
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public List<User> Users { get; } = new List<User>();
    }
}
