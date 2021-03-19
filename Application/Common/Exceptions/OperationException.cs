using System;
using System.Collections.Generic;

namespace Application.Common.Exceptions
{
    public class OperationException : Exception
    {
        public int StatusCode { get; }

        public IEnumerable<string> Errors { get; } = Array.Empty<string>();

        public OperationException(int statusCode = 500) : base("Operation failed")
        {
            StatusCode = statusCode;
        }

        public OperationException(IEnumerable<string> errors, int statusCode = 500) : this(statusCode)
        {
            Errors = errors;
        }
    }
}
