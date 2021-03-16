using System.Collections.Generic;
using System.Security.Claims;

namespace Application.Common.Interfaces
{
    public interface IJwtService
    {
        string GenerateJwt(IEnumerable<Claim> claims);
    }
}
