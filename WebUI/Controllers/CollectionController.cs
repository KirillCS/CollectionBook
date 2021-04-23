using Application.Collections.Commands.ChangeCollectionDescription;
using Application.Collections.Commands.ChangeCollectionName;
using Application.Collections.Commands.ChangeCollectionTags;
using Application.Collections.Commands.CreateCollection;
using Application.Collections.Commands.DeleteCollection;
using Application.Collections.Commands.StarCollection;
using Application.Collections.Queries.GetCollectionAndItems;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class CollectionController : ApiControllerBase
    {
        [Route("{Id}")]
        [HttpGet]
        public async Task<IActionResult> GetCollectionAndItems([FromRoute] GetCollectionAndItemsQuery query)
        {
            return Ok(await Mediator.Send(query));
        }

        [Route("{Id}")]
        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteCollection([FromRoute] DeleteCollectionCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("create")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCollection([FromForm] CreateCollectionCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("change/name")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ChangeCollectionName([FromBody] ChangeCollectionNameCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("change/description")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ChangeCollectionDescription([FromBody] ChangeCollectionDescriptionCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("change/tags")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ChangeCollectionTags([FromBody] ChangeCollectionTagsCommand command)
        {
            return Ok(await Mediator.Send(command));
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
