using System;

namespace Application.Common.Exceptions
{
    public class ForbiddenAccessException : Exception
    {
        public ForbiddenAccessException(string accessToken)
        {
            AccessToken = accessToken;
        }

        public string AccessToken { get; }
    }
}
