using Application.Email.Queries.GetEmailConfirmationStatus;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class EmailController : ApiControllerBase
    {
        [Route("confirmed")]
        [HttpGet]
        public async Task<IActionResult> IsEmailConfirmed([FromQuery]GetEmailConfirmationStatusQuery query)
        {
            return Ok(await Mediator.Send(query));
        }
    }
}
