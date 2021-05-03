using Application.Users.Commands.ResetPassword;
using Application.Users.Commands.SendPasswordResetConfirmation;
using Application.Users.Commands.UpdateAvatar;
using Application.Users.Commands.UpdateLogin;
using Application.Users.Commands.UpdatePassword;
using Application.Users.Commands.UpdateProfile;
using Application.Users.Queries.GetCollections;
using Application.Users.Queries.GetCollectionsNames;
using Application.Users.Queries.GetStarredCollections;
using Application.Users.Queries.GetStarsNotifications;
using Application.Users.Queries.GetUser;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class UserController : ApiControllerBase
    {
        [Route("{Login}")]
        [HttpGet]
        public async Task<IActionResult> GetUser([FromRoute] GetUserQuery query) =>
            Ok(await Mediator.Send(query));

        [Route("collections")]
        [HttpGet]
        public async Task<IActionResult> GetCollections([FromQuery] GetCollectionsQuery query) =>
            Ok(await Mediator.Send(query));

        [Route("collections/names")]
        [HttpGet]
        public async Task<IActionResult> GetCollectionsNames([FromQuery] GetCollectionsNamesQuery query) =>
            Ok(await Mediator.Send(query));

        [Route("stars")]
        [HttpGet]
        public async Task<IActionResult> GetStarredCollections([FromQuery] GetStarredCollectionsQuery query) =>
            Ok(await Mediator.Send(query));

        [Route("stars/notifications")]
        [HttpGet]
        public async Task<IActionResult> GetStarsNotifications([FromQuery] GetStarsNotificationsQuery query) =>
            Ok(await Mediator.Send(query));

        [Route("avatar/update")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UpdateAvatar([FromForm] UpdateAvatarCommand command) =>
            Ok(await Mediator.Send(command));

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
