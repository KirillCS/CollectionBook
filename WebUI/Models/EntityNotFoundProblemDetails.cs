using Microsoft.AspNetCore.Mvc;

namespace WebUI.Models
{
    public class EntityNotFoundProblemDetails : ProblemDetails
    {
        public string EntityType { get; set; }
    }
}
