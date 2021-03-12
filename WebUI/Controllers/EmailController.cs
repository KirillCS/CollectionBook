using Application.Email.Commands.ConfirmEmail;
using Application.Email.Commands.SendConfirmationEmail;
using Application.Email.Commands.UpdateEmail;
using Application.Email.Queries.GetEmailConfirmationStatus;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class EmailController : ApiControllerBase
    {
        [Route("confirmed")]
        [HttpGet]
        public async Task<IActionResult> IsEmailConfirmed([FromQuery] GetEmailConfirmationStatusQuery query)
        {
            return Ok(await Mediator.Send(query));
        }

        [Route("sendconfirmation")]
        [HttpGet]
        public async Task<IActionResult> SendConfirmationEmail([FromQuery] SendConfirmationEmailCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("update")]
        [HttpPut]
        public async Task<IActionResult> UpdateEmail([FromBody] UpdateEmailCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [Route("confirm")]
        [HttpPut]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}
