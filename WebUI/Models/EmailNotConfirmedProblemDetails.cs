using Microsoft.AspNetCore.Mvc;

namespace WebUI.Models
{
    public class EmailNotConfirmedProblemDetails : ProblemDetails
    {
        public string Id { get; set; }

        public string Email { get; set; }
    }
}
