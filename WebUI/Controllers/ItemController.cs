using Application.Items.Commands.ChangeItemInfo;
using Application.Items.Commands.ChangeItemName;
using Application.Items.Commands.ChangeItemTags;
using Application.Items.Commands.CreateItem;
using Application.Items.Queries.GetItem;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class ItemController : ApiControllerBase
    {
        [Route("{Id}")]
        [HttpGet]
        public async Task<IActionResult> GetItem([FromRoute] GetItemQuery query) =>
            Ok(await Mediator.Send(query));

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateItem([FromBody] CreateItemCommand command) =>
            Ok(await Mediator.Send(command));

        [Route("name")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> ChangeItemName([FromBody] ChangeItemNameCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("info")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> ChangeItemInfo([FromBody] ChangeItemInfoCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }

        [Route("tags")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> ChangeItemTags([FromBody] ChangeItemTagsCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }
    }
}
