using ExpensesTrackerAdmin.Models.DTOs;
using ExpensesTrackerAdmin.Models.Enums;
using ExpensesTrackerAdmin.Repository.Entities;
using ExpensesTrackerAdmin.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace ExpensesTrackerAdmin.Services
{
    public class AccountService : IAccountService
    {
        private readonly SignInManager<AspNetUser> _signInManager;
        private readonly UserManager<AspNetUser> _userManager;

        public AccountService(SignInManager<AspNetUser> signInManager, UserManager<AspNetUser> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        public async Task<UserDTO> LoginUserAsync(LoginUserDTO loginUser)
        {
            var loginResult = await _signInManager.PasswordSignInAsync(loginUser.UserName, loginUser.Password, loginUser.IsPersistent, lockoutOnFailure: false);
            if (loginResult.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(loginUser.UserName);

                if (user == null)
                {
                    throw new ArgumentException("User does not exist.");
                }

                if (!(await _userManager.GetRolesAsync(user)).Contains(AppUserRoles.Admin.ToString()))
                {
                    throw new InvalidOperationException("Your account does not have the necessary administrator privileges to log in.");
                }

                return new UserDTO() { Id = user.Id, Name = user.Name, Email = user.Email, Phone = user.PhoneNumber, CreateDt = user.CreateDt, UpdateDt = user.UpdateDt };
            }
            else
            {
                throw new ArgumentException("Invalid username or password.");
            }
        }

        public async Task<bool> IsValidUserAndRefreshToken(string userId, string refreshToken)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if(user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiration <= DateTime.Now)
            {
                return false;
            }

            return true;
        }
    }
}
