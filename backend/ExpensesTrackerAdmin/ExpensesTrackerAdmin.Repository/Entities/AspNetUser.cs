using Microsoft.AspNetCore.Identity;

namespace ExpensesTrackerAdmin.Repository.Entities;

public partial class AspNetUser : IdentityUser<Guid>
{
    public string? Name { get; set; }

    public DateTime? CreateDt { get; set; }

    public DateTime? UpdateDt { get; set; }

    public string? RefreshToken { get; set; }

    public DateTime? RefreshTokenExpiration { get; set; }
}
