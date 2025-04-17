using ExpensesTrackerAdmin.Models.DTOs;
using ExpensesTrackerAdmin.Models.Enums;
using ExpensesTrackerAdmin.Repository.Entities;
using ExpensesTrackerAdmin.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ExpensesTrackerAdmin.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<AspNetUser> _userManager;
        private readonly RoleManager<AspNetRole> _roleManager;
        private readonly IConfiguration _configuration;

        public UserService(UserManager<AspNetUser> userManager, RoleManager<AspNetRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        public async Task<List<UserDTO>> GetAllUsersAsync()
        {
            return await _userManager.Users.Select(user => new UserDTO() { Id = user.Id, Name = user.Name, Email = user.Email, Phone = user.PhoneNumber, CreateDt = user.CreateDt, UpdateDt = user.UpdateDt })
                                           .ToListAsync();
        }

        public async Task<UserDTO> GetUserByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return null;
            }
            else
            {
                return new UserDTO() { Id = user.Id, Name = user.Name, Email = user.Email, Phone = user.PhoneNumber, CreateDt = user.CreateDt, UpdateDt = user.UpdateDt };
            }
        }

        public async Task<UserDTO> CreateUserAsync(NewUserDTO newUser)
        {
            if((await _userManager.FindByEmailAsync(newUser.Email)) is not null)
            {
                throw new ArgumentException("Email is already used. Please try another email.");
            }

            AspNetUser user = new AspNetUser()
            {
                Name = newUser.Name,
                UserName = newUser.Email,
                Email = newUser.Email,
                PhoneNumber = newUser.Phone,
                CreateDt = DateTime.Now
            };

            var result = await _userManager.CreateAsync(user, newUser.Password);

            if (result.Succeeded)
            {
                if (newUser.Role == AppUserRoles.Admin)
                {
                    if (await _roleManager.FindByNameAsync(AppUserRoles.Admin.ToString()) is null)
                    {
                        await _roleManager.CreateAsync(new AspNetRole { Name = AppUserRoles.Admin.ToString() });
                    }
                    await _userManager.AddToRoleAsync(user, AppUserRoles.Admin.ToString());
                }
                else if (newUser.Role == AppUserRoles.User)
                {

                    if (await _roleManager.FindByNameAsync(AppUserRoles.User.ToString()) is null)
                    {
                        await _roleManager.CreateAsync(new AspNetRole { Name = AppUserRoles.User.ToString() });
                    }
                    await _userManager.AddToRoleAsync(user, AppUserRoles.User.ToString());
                }

                return new UserDTO()
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    CreateDt = user.CreateDt,
                    Phone = user.PhoneNumber,
                    UpdateDt = user.UpdateDt
                };
            }
            else
            {
                throw new InvalidOperationException("Failed to create user.");
            }
        }

        public async Task UpdateUserAsync(UpdateUserDTO updateUser)
        {
            var user = await _userManager.FindByIdAsync(updateUser.Id.ToString());

            if (user == null)
            {
                throw new ArgumentException("User does not exist.");
            }
            else
            {
                user.Name = updateUser.Name;
                user.UserName = updateUser.Email;
                user.Email = updateUser.Email;
                user.PhoneNumber = updateUser.Phone;
                user.UpdateDt = DateTime.Now;

                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded)
                {
                    throw new InvalidOperationException(result.Errors.FirstOrDefault()?.Description);
                }
            }
        }

        public async Task DeleteUserAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                throw new ArgumentException("User does not exist.");
            }
            else
            {
                if ((await _userManager.GetRolesAsync(user)).Contains(AppUserRoles.Admin.ToString()))
                {
                    throw new InvalidOperationException("Administrator accounts cannot be deleted. If you believe this is incorrect, please contact your system administrator.");
                }

                var result = await _userManager.DeleteAsync(user);

                if (!result.Succeeded)
                {
                    throw new InvalidOperationException(result.Errors.FirstOrDefault()?.Description);
                }
            }
        }

        public async Task UpdateUserRefreshTokenAsync(string userId, string refreshToken, bool isLogout = false)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) 
            {
                throw new ArgumentException("User does not exist.");
            }
            else
            {
                user.RefreshToken = isLogout ? null : refreshToken;
                user.RefreshTokenExpiration = isLogout ? null : DateTime.UtcNow.AddDays(_configuration.GetSection("JWT").GetValue<int>("RefreshTokenExpiration"));

                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded)
                {
                    throw new InvalidOperationException(result.Errors.FirstOrDefault()?.Description);
                }
            }
        }
    }
}
