using Application.Common.Interfaces;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Infrastructure.Services
{
    public class JwtService : IJwtService
    {
        private readonly IOptions<AuthOptions> authOptions;

        public JwtService(IOptions<AuthOptions> authOptions)
        {
            this.authOptions = authOptions;
        }

        public string GenerateJwt(IEnumerable<Claim> claims)
        {
            var authParams = authOptions.Value;
            var credentials = new SigningCredentials(authParams.SymmetricSecurityKey, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(issuer: authParams.Issuer,
                                             audience: authParams.Audience,
                                             claims: claims,
                                             expires: DateTime.Now.AddSeconds(authParams.TokenLifetime),
                                             signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
