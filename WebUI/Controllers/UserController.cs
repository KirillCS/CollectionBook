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
using System;
using System.Threading.Tasks;
using WebUI.Interfaces;

namespace WebUI.Controllers
{
    public class UserController : ApiControllerBase
    {
        private readonly IFormFileSaver fileSaver;

        public UserController(IFormFileSaver fileSaver)
        {
            this.fileSaver = fileSaver;
        }

        [Route("{Login}")]
        [HttpGet]
        public async Task<IActionResult> GetUser([FromRoute] GetUserQuery query)
        {
            return Ok(await Mediator.Send(query));
        }

        [Route("updateavatar")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UpdateAvatar([FromForm] IFormFile avatar)
        {
            var fileName = await fileSaver.SaveAvatar(avatar, $"{User.Identity.Name}_{Guid.NewGuid()}");

            var command = new UpdateAvatarCommand { AvatarPath = fileName };

            await Mediator.Send(command);

            return Ok();
        }

        [Route("updateprofile")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("updatelogin")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateLogin([FromBody] UpdateLoginCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [Route("updatepassword")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("sendreset")]
        [HttpPost]
        public async Task<IActionResult> SendPasswordResetConfirmation([FromBody] SendPasswordResetConfirmationCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("resetpassword")]
        [HttpPut]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }
    }
}
