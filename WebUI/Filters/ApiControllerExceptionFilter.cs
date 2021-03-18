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
                { typeof(UpdateEmailException), HandleUpdateEmailException },
                { typeof(EmailConfirmationException), HandleEmailConfirmationException },
                { typeof(EmailUpdatingConfirmationException), HandleEmailUpdatingConfirmationException },
                { typeof(UpdateLoginException), HandleUpdateLoginException },
                { typeof(UpdateProfileException), HandleUpdateProfileException },
                { typeof(IdentityNotFoundException), HandleIdentityNotFoundException },
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

        private void HandleEmailNotConfirmedException(ExceptionContext context)
        {
            var exception = context.Exception as EmailNotConfirmedException;
            var details = new EmailNotConfirmedDetails()
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

        private void HandleUpdateEmailException(ExceptionContext context)
        {
            var exception = context.Exception as UpdateEmailException;
            var details = new ProblemDetails()
            {
                Status = StatusCodes.Status400BadRequest,
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.3",
                Title = exception.Message,
                Detail = exception.Message
            };

            context.Result = new BadRequestObjectResult(details);
            context.ExceptionHandled = true;
        }

        private void HandleEmailConfirmationException(ExceptionContext context)
        {
            var exception = context.Exception as EmailConfirmationException;
            var details = new ErrorEmailConfirmationDetails()
            {
                Status = StatusCodes.Status400BadRequest,
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Title = exception.Message,
                Detail = exception.Message,
                Errors = exception.Errors
            };

            context.Result = new BadRequestObjectResult(details);
            context.ExceptionHandled = true;
        }

        private void HandleEmailUpdatingConfirmationException(ExceptionContext context)
        {
            var exception = context.Exception as EmailUpdatingConfirmationException;
            var details = new ErrorEmailConfirmationDetails()
            {
                Status = StatusCodes.Status400BadRequest,
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Title = exception.Message,
                Detail = exception.Message,
                Errors = exception.Errors
            };

            context.Result = new BadRequestObjectResult(details);
            context.ExceptionHandled = true;
        }

        private void HandleUpdateLoginException(ExceptionContext context)
        {
            var exception = context.Exception as UpdateLoginException;
            var details = new ProblemDetails()
            {
                Status = StatusCodes.Status400BadRequest,
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Title = exception.Message,
                Detail = exception.Message
            };

            context.Result = new BadRequestObjectResult(details);
            context.ExceptionHandled = true;
        }

        private void HandleUpdateProfileException(ExceptionContext context)
        {
            var exception = context.Exception as UpdateProfileException;
            var details = new ProblemDetails()
            {
                Status = StatusCodes.Status400BadRequest,
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Title = exception.Message,
                Detail = exception.Message
            };

            context.Result = new BadRequestObjectResult(details);
            context.ExceptionHandled = true;
        }

        private void HandleIdentityNotFoundException(ExceptionContext context)
        {
            var exception = context.Exception as IdentityNotFoundException;
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
