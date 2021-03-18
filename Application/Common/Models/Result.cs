using System;
using System.Collections.Generic;
using System.Linq;

namespace Application.Common.Models
{
    public class Result
    {
        public bool Successed { get; set; }

        public string[] Errors { get; set; }

        protected Result(bool successed, IEnumerable<string> errors)
        {
            Successed = successed;
            Errors = errors.ToArray();
        }

        public static Result Success()
        {
            return new Result(true, Array.Empty<string>());
        }

        public static Result Failure(IEnumerable<string> errors)
        {
            return new Result(false, errors);
        }
    }
}
