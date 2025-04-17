using ExpensesTrackerAdmin.Models.DTOs;
using System.Security.Claims;

namespace ExpensesTrackerAdmin.Services.Interfaces
{
    public interface IJwtService
    {
        /// <summary>
        /// Generate JWT & Refresh Token.
        /// </summary>
        /// <param name="user">UserDTO</param>
        /// <returns>TokenDTO</returns>
        TokenDTO GenerateToken(UserDTO user);
        /// <summary>
        /// Get User Claims from JWT payload.
        /// </summary>
        /// <param name="token">Expired JWT</param>
        /// <returns>ClaimsPrincipal</returns>
        ClaimsPrincipal GetClaimsPrincipalFromJwtToken(string token);
    }
}
