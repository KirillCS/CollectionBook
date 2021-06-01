using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ValidationException = Application.Common.Exceptions.ValidationException;
using Infrastructure.Exceptions;
using Application.Common.Exceptions;
using WebUI.Models;

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
                { typeof(EmailNotConfirmedException), HandleEmailNotConfirmedException },
                { typeof(EntityNotFoundException), HandleEntityNotFoundException },
                { typeof(OperationException), HandleOperationException },
                { typeof(UnauthorizedAccessException), HandleUnauthorizedAccessException },
                { typeof(UserBlockedException), HandleUserBlockedException },
                { typeof(ForbiddenAccessException), HandleForbiddenAccessException },
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

        private void HandleEmailNotConfirmedException(ExceptionContext context)
        {
            var exception = context.Exception as EmailNotConfirmedException;
            var details = new EmailNotConfirmedProblemDetails()
            {
                Status = StatusCodes.Status403Forbidden,
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.3",
                Title = exception.Message,
                Detail = exception.Message,
                Id = exception.UserId,
                Email = exception.Email
            };

            context.Result = new ObjectResult(details);
            context.ExceptionHandled = true;
        }

        private void HandleEntityNotFoundException(ExceptionContext context)
        {
            var exception = context.Exception as EntityNotFoundException;
            var details = new EntityNotFoundProblemDetails()
            {
                Status = StatusCodes.Status404NotFound,
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                Title = exception.Message,
                Detail = exception.Message,
                EntityType = exception.EntityType
            };

            context.Result = new NotFoundObjectResult(details);
            context.ExceptionHandled = true;
        }

        private void HandleOperationException(ExceptionContext context)
        {
            var exception = context.Exception as OperationException;
            var details = new ProblemDetails()
            {
                Status = exception.StatusCode,
                Title = exception.Message,
                Detail = exception.Message
            };

            context.Result = new ObjectResult(details);
            context.ExceptionHandled = true;
        }

        private void HandleUnauthorizedAccessException(ExceptionContext context)
        {
            var details = new ProblemDetails()
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "User is unauthorized",
                Detail = "User is unauthorized"
            };

            context.Result = new ObjectResult(details);
            context.ExceptionHandled = true;
        }

        private void HandleUserBlockedException(ExceptionContext context)
        {
            var exception = context.Exception as UserBlockedException;
            var details = new UserBlockedProblemDetails()
            {
                Status = StatusCodes.Status405MethodNotAllowed,
                Title = "User is blocked",
                Detail = $"User is blocked. Reason: {exception.BlockReason}",
                BlockReason = exception.BlockReason
            };

            context.Result = new ObjectResult(details);
            context.ExceptionHandled = true;
        }

        private void HandleForbiddenAccessException(ExceptionContext context)
        {
            var details = new ProblemDetails()
            {
                Status = StatusCodes.Status403Forbidden,
                Title = "User has not access",
                Detail = "User has not access"
            };

            context.Result = new ObjectResult(details);
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
