using System;

namespace Application.Common.Exceptions
{
    public class OperationException : Exception
    {
        public int StatusCode { get; }

        public OperationException(int statusCode = 500) : base("Operation failed")
        {
            StatusCode = statusCode;
        }
    }
}
