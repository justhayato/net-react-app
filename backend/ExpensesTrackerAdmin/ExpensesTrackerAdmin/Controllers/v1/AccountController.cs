using Asp.Versioning;
using ExpensesTrackerAdmin.Models.DTOs;
using ExpensesTrackerAdmin.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExpensesTrackerAdmin.WebAPI.Controllers.v1
{
    /// <summary>
    /// Account Endpoints
    /// </summary>
    [AllowAnonymous]
    [ApiVersion("1.0")]
    public class AccountController : CustomBaseController
    {
        private readonly IAccountService _accountService;
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;
        private readonly ILogger<AccountController> _logger;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="accountService"></param>
        /// <param name="jwtService"></param>
        /// <param name="logger"></param>
        /// <param name="userService"></param>
        public AccountController(IAccountService accountService, IJwtService jwtService, IUserService userService, ILogger<AccountController> logger)
        {
            _accountService = accountService;
            _jwtService = jwtService;
            _userService = userService;
            _logger = logger;
        }

        /// <summary>
        /// Login user with username and password.
        /// </summary>
        /// <param name="loginUser">User Details</param>
        /// <returns></returns>
        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginUserDTO loginUser)
        {
            try
            {
                var user = await _accountService.LoginUserAsync(loginUser);

                var tokens = _jwtService.GenerateToken(user);

                await _userService.UpdateUserRefreshTokenAsync(user.Id.ToString(), tokens.RefreshToken!);

                return Ok(tokens);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "========== ERROR ==========\n" +
                    "Message: An error occured while processing User Log In.\n" +
                    "Controller: {ControllerName}\n" +
                    "Action: {ActionName}\n"
                    , nameof(AccountController), nameof(Login));

                if (ex is ArgumentException || ex is InvalidOperationException)
                {
                    return BadRequest(ex.Message);
                }
                return Problem(statusCode: 500, title: "Internal Server Error", detail: "An unhandled exception occured.");
            }
        }

        /// <summary>
        /// Logs out the logged in user.
        /// </summary>
        /// <returns></returns>
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout(UserDTO user)
        {
            try
            {
                await _userService.UpdateUserRefreshTokenAsync(user.Id.ToString(), null, true);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "========== ERROR ==========\n" +
                    "Message: An error occured while processing User Log Out.\n" +
                    "Controller: {ControllerName}\n" +
                    "Action: {ActionName}\n"
                    , nameof(AccountController), nameof(Logout));

                return Problem(statusCode: 500, title: "Internal Server Error", detail: "An unhandled exception occured.");
            }
        }

        /// <summary>
        /// Regnerate new JWT and RefreshTokens
        /// </summary>
        /// <param name="tokens">JWT and RefreshToken</param>
        /// <returns>TokenDTO</returns>
        [HttpPost("Refresh")]
        public async Task<IActionResult> RegenerateTokens(TokenDTO tokens)
        {
            try
            {
                var claimsPrincipal = _jwtService.GetClaimsPrincipalFromJwtToken(tokens.Token!);
                var userId = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);

                // validate if user exists, refresh token is valid, refresh token is not expired
                if (!await _accountService.IsValidUserAndRefreshToken(userId, tokens.RefreshToken!))
                {
                    return Unauthorized("Invalid tokens.");
                }

                var user = await _userService.GetUserByIdAsync(userId);
                var newTokens = _jwtService.GenerateToken(user);
                await _userService.UpdateUserRefreshTokenAsync(user.Id.ToString(), newTokens.RefreshToken!);

                return Ok(newTokens);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "========== ERROR ==========\n" +
                    "Message: An error occured while regenerating new Tokens.\n" +
                    "Controller: {ControllerName}\n" +
                    "Action: {ActionName}\n"
                    , nameof(AccountController), nameof(RegenerateTokens));

                return Unauthorized();
            }
        }
    }
}
