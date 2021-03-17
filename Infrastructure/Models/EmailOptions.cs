namespace Infrastructure.Models
{
    public class EmailOptions
    {
        public string Address { get; set; }

        public string Name { get; set; }

        public string ConfirmationSubject { get; set; }

        public string ConfirmationMessage { get; set; }

        public string ChangingSubject { get; set; }

        public string ChangingMessage { get; set; }
    }
}
