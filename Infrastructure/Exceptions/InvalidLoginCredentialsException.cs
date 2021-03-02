using System;

namespace Infrastructure.Exceptions
{
    public class InvalidLoginCredentialsException : Exception
    {
        public string Login { get; private set; }

        public InvalidLoginCredentialsException() : base("Invalid login credentials.")
        { }

        public InvalidLoginCredentialsException(string login) : this()
        {
            Login = login;
        }
    }
}
