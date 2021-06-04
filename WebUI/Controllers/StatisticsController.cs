using Application.Statistics.Queries.GetCounts;
using Application.Statistics.Queries.GetTopTags;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class StatisticsController : ApiControllerBase
    {
        [HttpGet("counts")]
        public async Task<IActionResult> GetCounts() =>
            Ok(await Mediator.Send(new GetCountsQuery()));

        [HttpGet("top/tags")]
        public async Task<IActionResult> GetTopTags([FromQuery] GetTopTagsQuery query) =>
            Ok(await Mediator.Send(query));
    }
}
