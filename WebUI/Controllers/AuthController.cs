using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ApiControllerBase
    {
        [Route("login")]
        [HttpPost]
        public async Task<LoginResponce> Login([FromBody]LoginCommand command)
        {
            return Ok(Mediator.Send(command));
        }
    }
}
