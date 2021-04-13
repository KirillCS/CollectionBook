using System.Collections.Generic;

namespace Application.Common.Interfaces
{
    public interface IUriService
    {
        string GenerateUri(string baseUrl, IDictionary<string, string> queryParams);
    }
}
