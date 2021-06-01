using Application.Stars.GetUsers;
using Application.Stars.ToggleStar;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class StarController : ApiControllerBase
    {
        [HttpGet]
        [Route("users")]
        public async Task<IActionResult> GetUsers([FromQuery] GetUsersQuery query) =>
            Ok(await Mediator.Send(query));

        [HttpPost]
        public async Task<IActionResult> ToggleStar([FromBody] ToggleStarCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }
    }
}
