using Application.Collections.Commands.ChangeCollectionCover;
using Application.Collections.Commands.ChangeCollectionDescription;
using Application.Collections.Commands.ChangeCollectionName;
using Application.Collections.Commands.ChangeCollectionTags;
using Application.Collections.Commands.CreateCollection;
using Application.Collections.Commands.DeleteCollection;
using Application.Collections.Commands.StarCollection;
using Application.Collections.Queries.GetCollection;
using Application.Collections.Queries.GetItems;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class CollectionController : ApiControllerBase
    {
        [Route("{Id}")]
        [HttpGet]
        public async Task<IActionResult> GetCollection([FromRoute] GetCollectionQuery query) =>
            Ok(await Mediator.Send(query));

        [Route("items")]
        [HttpGet]
        public async Task<IActionResult> GetItems([FromQuery] GetItemsQuery query) =>
            Ok(await Mediator.Send(query));

        [Route("{Id}")]
        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteCollection([FromRoute] DeleteCollectionCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCollection([FromForm] CreateCollectionCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("cover")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> ChangeCollectionCover([FromForm] ChangeCollectionCoverCommand command) =>
            Ok(await Mediator.Send(command));

        [Route("name")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> ChangeCollectionName([FromBody] ChangeCollectionNameCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("description")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> ChangeCollectionDescription([FromBody] ChangeCollectionDescriptionCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("tags")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> ChangeCollectionTags([FromBody] ChangeCollectionTagsCommand command) =>
            Ok(await Mediator.Send(command));

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
