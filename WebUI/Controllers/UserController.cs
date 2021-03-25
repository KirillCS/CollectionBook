using Application.Users.Commands.ResetPassword;
using Application.Users.Commands.SendPasswordResetConfirmation;
using Application.Users.Commands.UpdateAvatar;
using Application.Users.Commands.UpdateLogin;
using Application.Users.Commands.UpdatePassword;
using Application.Users.Commands.UpdateProfile;
using Application.Users.Queries.GetUser;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebUI.Interfaces;

namespace WebUI.Controllers
{
    public class UserController : ApiControllerBase
    {
        private readonly IAvatarService avatarService;

        public UserController(IAvatarService avatarService)
        {
            this.avatarService = avatarService;
        }

        [Route("{Login}")]
        [HttpGet]
        public async Task<IActionResult> GetUser([FromRoute] GetUserQuery query)
        {
            return Ok(await Mediator.Send(query));
        }

        [Route("avatar/update")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UpdateAvatar([FromForm] IFormFile avatar)
        {
            var fileName = await avatarService.UpdateAvatar(avatar);

            var command = new UpdateAvatarCommand { AvatarPath = fileName };

            await Mediator.Send(command);

            return Ok();
        }

        [Route("profile/update")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("login/update")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateLogin([FromBody] UpdateLoginCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [Route("password/update")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("password/sendresetconfirmation")]
        [HttpPost]
        public async Task<IActionResult> SendPasswordResetConfirmation([FromBody] SendPasswordResetConfirmationCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("password/reset")]
        [HttpPut]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }
    }
}
