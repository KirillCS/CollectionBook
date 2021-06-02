using Application.Administration.Commands.ChangeUserBlockStatus;
using Application.Administration.Commands.ToggleUserRole;
using Application.Administration.Queries.GetDashboardReports;
using Application.Administration.Queries.GetDashboardUsers;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    [Route("api/admin")]
    public class AdministrationController : ApiControllerBase
    {
        [HttpGet("users")]
        public async Task<IActionResult> GetDashboardUsers([FromQuery] GetDashboardUsersQuery query) =>
            Ok(await Mediator.Send(query));

        [HttpGet("reports")]
        public async Task<IActionResult> GetReports([FromQuery] GetDashboardReportsQuery query) =>
            Ok(await Mediator.Send(query));

        [HttpPost("role")]
        public async Task<IActionResult> ToggleUserRole([FromBody] ToggleUserRoleCommand command) =>
            Ok(await Mediator.Send(command));

        [HttpPost("block")]
        public async Task<IActionResult> ChangeUserBlockStatus([FromBody] ChangeUserBlockStatusCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }
    }
}
