using ExpensesTrackerAdmin.Models.DTOs;
using ExpensesTrackerAdmin.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ExpensesTrackerAdmin.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public TokenDTO GenerateToken(UserDTO user)
        {
            var dateNow = DateTime.UtcNow;

            // Claims
            var claims = new Claim[]
            {
                // subject (user id)
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                // token unique id
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                // issued at
                new Claim(JwtRegisteredClaimNames.Iat, dateNow.ToString()),

                // ===== custom claims/ app specific claims

                // email/username
                new Claim("user_email", user.Email??string.Empty),
                // full name
                new Claim("user_name", user.Name??string.Empty),
            };

            // Secret Key
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("JWT").GetValue<string>("SecretKey")));

            // Signing Credentials
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            // Token Expiration
            var expiration = dateNow.AddMinutes(_configuration.GetSection("JWT").GetValue<double>("Expiration"));

            // =================

            // JWT Token Details
            var token = new JwtSecurityToken(
                issuer: _configuration.GetSection("JWT").GetValue<string>("Issuer"),
                audience: _configuration.GetSection("JWT").GetValue<string>("Audience"),
                claims: claims,
                signingCredentials: signingCredentials,
                expires: expiration
            );

            // JWT Token Generator
            var tokenResponse = new TokenDTO()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                RefreshToken = GenerateRefreshToken()
            };

            // Save RefreshToken To Database

            return tokenResponse;
        }

        public ClaimsPrincipal GetClaimsPrincipalFromJwtToken(string token)
        {
            var tokenValidationParams = new TokenValidationParameters()
            {
                ValidateIssuer = true, // Issuer
                ValidIssuer = _configuration.GetSection("JWT").GetValue<string>("Issuer"),
                ValidateAudience = true, // Audience
                ValidAudience = _configuration.GetSection("JWT").GetValue<string>("Audience"),

                ValidateIssuerSigningKey = true, // Signature
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("JWT").GetValue<string>("SecretKey"))),

                ValidateLifetime = false, // Expiration - don't validate expiration
            };

            // Retrieve "payload" from the token. Contains user Claims.
            ClaimsPrincipal claimsPrincipal = new JwtSecurityTokenHandler().ValidateToken(token, tokenValidationParams, out SecurityToken validatedToken);

            // Check if validated token is JWT and Hashing Algorithm in Header is HMACSHA256 
            if (validatedToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid Token");
            }

            return claimsPrincipal;
        }

        private string GenerateRefreshToken()
        {
            // randomly generate 64bytes of values
            var bytes = new byte[64];
            RandomNumberGenerator.Create().GetBytes(bytes); 

            // convert 64bytes to Base64 String (refresh token)
            return Convert.ToBase64String(bytes); 
        }
    }
}
