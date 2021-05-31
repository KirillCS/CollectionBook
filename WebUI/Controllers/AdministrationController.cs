using Application.Administration.Queries.GetUsers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class AdministrationController : ApiControllerBase
    {
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] GetUsersQuery query) =>
            Ok(await Mediator.Send(query));
    }
}
