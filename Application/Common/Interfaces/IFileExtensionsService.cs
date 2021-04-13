using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IFileExtensionsService
    {
        Task<string> UpdateAvatar(IFormFile avatar, string currentAvatar);

        Task<string> UpdateCollectionCover(IFormFile cover, string currentCover);
    }
}
