using System;

namespace Infrastructure.Exceptions
{
    public class EmailNotConfirmedException : Exception
    {
        public string UserId { get; set; }

        public string Email { get; set; }

        public EmailNotConfirmedException(string userId, string email) : base($"Email {email} is not confirmed")
        {
            UserId = userId;
            Email = email;
        }
    }
}
