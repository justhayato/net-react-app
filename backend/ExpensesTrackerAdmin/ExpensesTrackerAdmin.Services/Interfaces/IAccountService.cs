using ExpensesTrackerAdmin.Models.DTOs;

namespace ExpensesTrackerAdmin.Services.Interfaces
{
    public interface IAccountService
    {
        Task<UserDTO> LoginUserAsync(LoginUserDTO loginUser);
        Task<bool> IsValidUserAndRefreshToken(string userId, string refreshToken);
    }
}
