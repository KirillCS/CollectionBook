using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface ICollectionCoverService
    {
        Task<string> Save(IFormFile cover);
    }
}
