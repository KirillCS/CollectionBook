namespace Application.Auth.Commands.Login
{
    public class LoginResponse
    {
        public LoginUserDto User { get; set; }

        public string AccessToken { get; set; }
    }
}
