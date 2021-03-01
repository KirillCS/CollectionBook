using Domain.Entities;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IJwtService
    {
        Task<string> GenerateJwt(User user);
    }
}
