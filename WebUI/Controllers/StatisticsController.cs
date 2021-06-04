using Application.Statistics.Queries.GetCounts;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class StatisticsController : ApiControllerBase
    {
        [HttpGet("counts")]
        public async Task<IActionResult> GetCounts() =>
            Ok(await Mediator.Send(new GetCountsQuery()));
    }
}
