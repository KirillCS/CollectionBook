using Microsoft.AspNetCore.Mvc;

namespace WebUI.Models
{
    public class UserBlockedProblemDetails : ProblemDetails
    {
        public string BlockReason { get; set; }
    }
}
