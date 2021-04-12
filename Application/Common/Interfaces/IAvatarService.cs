using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IAvatarService
    {
        Task<string> Update(IFormFile avatar, string currentAvatar);
    }
}
