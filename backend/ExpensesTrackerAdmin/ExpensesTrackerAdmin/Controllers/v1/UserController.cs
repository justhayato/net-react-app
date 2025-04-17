using Asp.Versioning;
using ExpensesTrackerAdmin.Models.DTOs;
using ExpensesTrackerAdmin.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesTrackerAdmin.WebAPI.Controllers.v1
{
    /// <summary>
    /// User Endpoints
    /// </summary>
    [ApiVersion("1.0")]
    public class UserController : CustomBaseController
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="userService">User service Layer</param>
        /// <param name="logger"></param>
        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves list of exising users.
        /// </summary>
        /// <returns>List of all UserDTO</returns>
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var userList = await _userService.GetAllUsersAsync();
                return Ok(userList);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "========== ERROR ==========\n" +
                    "Message: An error occured while generating User list.\n" +
                    "Controller: {ControllerName}\n" +
                    "Action: {ActionName}\n"
                    , nameof(UserController), nameof(GetUsers));

                return Problem(statusCode:500, title: "Internal Server Error", detail: "An unhandled exception occured.");
            }
        }

        /// <summary>
        /// Retrieves an existing user by id.
        /// </summary>
        /// <param name="id">User's ID</param>
        /// <returns>UserDTO</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);

                if(user == null)
                {
                    return NotFound("User does not exist.");
                }
                else
                {
                    return Ok(user);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "========== ERROR ==========\n" +
                    "Message: An error occured while retrieving a User.\n" +
                    "Controller: {ControllerName}\n" +
                    "Action: {ActionName}\n"
                    , nameof(UserController), nameof(GetUserById));

                return Problem(statusCode: 500, title: "Internal Server Error", detail: "An unhandled exception occured.");
            }
        }

        /// <summary>
        /// Creates a new user.
        /// </summary>
        /// <param name="newUser">New user details</param>
        /// <returns>UserDTO</returns>
        [HttpPost]
        public async Task<IActionResult> CreateUser(NewUserDTO newUser)
        {
            try
            {
                var user = await _userService.CreateUserAsync(newUser);

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "========== ERROR ==========\n" +
                    "Message: An error occured while creating a new user.\n" +
                    "Controller: {ControllerName}\n" +
                    "Action: {ActionName}\n"
                    , nameof(UserController), nameof(CreateUser));

                if (ex is ArgumentException || ex is InvalidOperationException)
                {
                    return BadRequest(ex.Message);
                }
                return Problem(statusCode: 500, title: "Internal Server Error", detail: "An unhandled exception occured.");
            }
        }

        /// <summary>
        /// /// Updates an existing user.
        /// </summary>
        /// <param name="updateUser">User details</param>
        /// <returns>none</returns>
        [HttpPatch]
        public async Task<IActionResult> UpdateUser(UpdateUserDTO updateUser)
        {
            try
            {
                await _userService.UpdateUserAsync(updateUser);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "========== ERROR ==========\n" +
                    "Message: An error occured while updating an existing user.\n" +
                    "Controller: {ControllerName}\n" +
                    "Action: {ActionName}\n"
                    , nameof(UserController), nameof(UpdateUser));

                if (ex is ArgumentException || ex is InvalidOperationException)
                {
                    return BadRequest(ex.Message);
                }

                return Problem(statusCode: 500, title: "Internal Server Error", detail: "An unhandled exception occured.");
            }
        }

        /// <summary>
        /// Deletes an existing user.
        /// </summary>
        /// <param name="id">User Id</param>
        /// <returns>none</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "========== ERROR ==========\n" +
                    "Message: An error occured while deleting an existing user.\n" +
                    "Controller: {ControllerName}\n" +
                    "Action: {ActionName}\n"
                    , nameof(UserController), nameof(DeleteUser));

                if (ex is ArgumentException || ex is InvalidOperationException)
                {
                    return BadRequest(ex.Message);
                }

                return Problem(statusCode: 500, title: "Internal Server Error", detail: "An unhandled exception occured.");
            }
        }
    }
}
