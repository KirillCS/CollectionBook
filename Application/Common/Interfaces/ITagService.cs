using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface ITagService
    {
        Task<IEnumerable<Tag>> Add(IEnumerable<string> tags);
    }
}
