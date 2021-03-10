using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ValidationException = Application.Common.Exceptions.ValidationException;
using Infrastructure.Exceptions;
using Application.Common.Exceptions;

namespace WebUI.Filters
{
    public class ApiControllerExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private readonly IDictionary<Type, Action<ExceptionContext>> exceptionHandlers;

        public ApiControllerExceptionFilterAttribute()
        {
            exceptionHandlers = new Dictionary<Type, Action<ExceptionContext>>
            {
                { typeof(ValidationException), HandleValidationException },
                { typeof(InvalidLoginCredentialsException), HandleInvalidLoginCredentialsException },
                { typeof(EntityNotFoundException), HandleEntityNotFoundException }
            };
        }

        public override void OnException(ExceptionContext context)
        {
            HandleException(context);
            base.OnException(context);
        }

        private void HandleException(ExceptionContext context)
        {
            var exceptionType = context.Exception.GetType();
            if (exceptionHandlers.ContainsKey(exceptionType))
            {
                exceptionHandlers[exceptionType].Invoke(context);
                return;
            }

            HandleUnknownException(context);
        }

        private void HandleValidationException(ExceptionContext context)
        {
            var exception = context.Exception as ValidationException;
            var details = new ValidationProblemDetails(exception.Errors)
            {
                Status = StatusCodes.Status400BadRequest,
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Title = "The received data was not validated.",
                Detail = exception.Message
            };

            context.Result = new BadRequestObjectResult(details);
            context.ExceptionHandled = true;
        }

        private void HandleInvalidLoginCredentialsException(ExceptionContext context)
        {
            var exception = context.Exception as InvalidLoginCredentialsException;
            var details = new ProblemDetails()
            {
                Status = StatusCodes.Status401Unauthorized,
                Type = "https://tools.ietf.org/html/rfc7235#section-3.1",
                Title = exception.Message,
                Detail = exception.Message
            };

            context.Result = new UnauthorizedObjectResult(details);
            context.ExceptionHandled = true;
        }

        private void HandleEntityNotFoundException(ExceptionContext context)
        {
            var exception = context.Exception as EntityNotFoundException;
            var details = new ProblemDetails()
            {
                Status = StatusCodes.Status404NotFound,
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                Title = exception.Message,
                Detail = exception.Message
            };

            context.Result = new NotFoundObjectResult(details);
            context.ExceptionHandled = true;
        }

        private void HandleUnknownException(ExceptionContext context)
        {
            var details = new ProblemDetails()
            {
                Status = StatusCodes.Status500InternalServerError,
                Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                Title = "Something went wrong",
                Detail = context.Exception.Message
            };

            context.Result = new ObjectResult(details) { StatusCode = details.Status };
            context.ExceptionHandled = true;
        }
    }
}
