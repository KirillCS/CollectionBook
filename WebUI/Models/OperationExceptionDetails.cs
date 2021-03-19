using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace WebUI.Models
{
    public class OperationExceptionDetails : ProblemDetails
    {
        public IEnumerable<string> Errors { get; } = Array.Empty<string>();

        public OperationExceptionDetails()
        { }

        public OperationExceptionDetails(IEnumerable<string> errors)
        {
            Errors = errors;
        }
    }
}
