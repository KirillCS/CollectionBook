using Application.Stars.GetUsersStarCollection;
using Application.Stars.ToggleStar;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class StarController : ApiControllerBase
    {
        [HttpGet]
        [Route("users")]
        public async Task<IActionResult> GetUsersStarCollection([FromQuery] GetUsersStarCollectionQuery query) =>
            Ok(await Mediator.Send(query));

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ToggleStar([FromBody] ToggleStarCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }
    }
}
