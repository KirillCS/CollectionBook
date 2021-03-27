using Application.Tags.Query.SearchTags;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class TagController : ApiControllerBase
    {
        [Route("search")]
        [HttpGet]
        public async Task<IActionResult> SearchTags([FromQuery] SearchTagsQuery query)
        {
            return Ok(await Mediator.Send(query));
        }
    }
}
