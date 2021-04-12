namespace Infrastructure.Options
{
    public class EmailOptions
    {
        public string Address { get; set; }

        public string Name { get; set; }

        public string ConfirmationSubject { get; set; }

        public string ConfirmationMessage { get; set; }

        public string ChangingSubject { get; set; }

        public string ChangingMessage { get; set; }

        public string PasswordResetSubject { get; set; }

        public string PasswordResetMessage { get; set; }
    }
}
