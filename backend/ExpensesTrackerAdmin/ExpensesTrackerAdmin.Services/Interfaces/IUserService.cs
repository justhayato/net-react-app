using ExpensesTrackerAdmin.Models.DTOs;

namespace ExpensesTrackerAdmin.Services.Interfaces
{
    /// <summary>
    /// User Service Layer
    /// </summary>
    public interface IUserService
    {
        /// <summary>
        /// Retrieve all users.
        /// </summary>
        /// <returns>List of UserDTO</returns>
        Task<List<UserDTO>> GetAllUsersAsync();
        /// <summary>
        /// Retrieve a user by id.
        /// </summary>
        /// <param name="id">GUID</param>
        /// <returns>UserDTO</returns>
        Task<UserDTO> GetUserByIdAsync(string id);
        /// <summary>
        /// Create a new user.
        /// </summary>
        /// <param name="newUser">User Details</param>
        /// <returns>UserDTO</returns>
        Task<UserDTO> CreateUserAsync(NewUserDTO newUser);
        /// <summary>
        /// Update an existing user.
        /// </summary>
        /// <param name="updateUser"></param>
        /// <returns></returns>
        Task UpdateUserAsync(UpdateUserDTO updateUser);
        /// <summary>
        /// Removes an existing user.
        /// </summary>
        /// <param name="id">GUID</param>
        /// <returns></returns>
        Task DeleteUserAsync(string id);
        /// <summary>
        /// Saves a new Refresh for the user.
        /// </summary>
        /// <param name="userId">GUID</param>
        /// <param name="refreshToken">New Generated RefreshToken</param>
        /// <param name="isLogout">boolean</param>
        /// <returns></returns>
        Task UpdateUserRefreshTokenAsync(string userId, string refreshToken, bool isLogout = false);
    }
}
