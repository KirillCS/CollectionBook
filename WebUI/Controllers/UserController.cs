using Application.Users.Commands.UpdateEmail;
using Application.Users.Commands.UpdateLogin;
using Application.Users.Commands.UpdateProfile;
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
        public async Task<IActionResult> GetUser([FromRoute] GetUserQuery query)
        {
            return Ok(await Mediator.Send(query));
        }

        [Route("updateprofile")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [Route("updatelogin")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateLogin([FromBody] UpdateLoginCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [Route("updateemail")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateEmail([FromBody] UpdateEmailCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }
    }
}
