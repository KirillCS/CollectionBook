using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace WebUI.Models
{
    public class ErrorEmailConfirmationDetails : ProblemDetails
    {
        public IEnumerable<string> Errors { get; set; }
    }
}
