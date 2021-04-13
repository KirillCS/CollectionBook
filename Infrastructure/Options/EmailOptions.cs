namespace Infrastructure.Options
{
    public class EmailOptions
    {
        public string Address { get; set; }

        public string Name { get; set; }

        public string EmailConfirmationSubject { get; set; }

        public string EmailConfirmationMessage { get; set; }

        public string EmailUpdateConfirmationSubject { get; set; }

        public string EmailUpdateConfirmationMessage { get; set; }

        public string PasswordResetSubject { get; set; }

        public string PasswordResetMessage { get; set; }
    }
}
