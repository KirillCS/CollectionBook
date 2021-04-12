using Application.UserEmail.Commands.ConfirmEmail;
using Application.UserEmail.Commands.SendConfirmationEmail;
using Application.UserEmail.Commands.ChangeUnconfirmedEmail;
using Application.UserEmail.Commands.UpdateEmail;
using Application.UserEmail.Queries.GetEmailConfirmationStatus;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Application.UserEmail.Commands.ConfirmEmailUpdating;

namespace WebUI.Controllers
{
    [Route("api/user/email")]
    public class UserEmailController : ApiControllerBase
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

        [Route("change")]
        [HttpPut]
        public async Task<IActionResult> ChangeUnconfirmedEmail([FromBody] ChangeUnconfirmedEmailCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("confirm")]
        [HttpPut]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [Route("update")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateEmail([FromBody] SendConfirmationEmailUpdateCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("confirmupdating")]
        [HttpPut]
        public async Task<IActionResult> ConfirmEmailUpdating([FromBody] UpdateEmailCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }
    }
}
