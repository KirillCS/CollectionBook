using Application.Users.Commands.SetProfile;
using Application.Users.Queries.GetProfile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class UserController : ApiControllerBase
    {
        [Route("{Login}")]
        [HttpGet]
        public async Task<IActionResult> GetUser([FromRoute] GetProfileQuery query)
        {
            return Ok(await Mediator.Send(query));
        }

        [Route("setprofile")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> SetProfile([FromBody] SetProfileCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}
