using Application.Collections.Commands.CreateCollection;
using Application.Collections.Commands.StarCollection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class CollectionController : ApiControllerBase
    {
        [Route("create")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCollection([FromForm] CreateCollectionCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("star")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> StarCollection([FromBody] StarCollectionCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }
    }
}
