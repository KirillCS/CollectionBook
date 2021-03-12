using Microsoft.AspNetCore.Mvc;

namespace WebUI.Models
{
    public class EmailNotConfirmedDetails : ProblemDetails
    {
        public string Id { get; set; }

        public string Email { get; set; }
    }
}
