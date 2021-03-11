using Application.Email.Commands.SendConfirmationEmail;
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

        [Route("sendconfirmation")]
        [HttpGet]
        public async Task<IActionResult> SendConfirmationEmail([FromQuery]SendConfirmationEmailCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }
    }
}
