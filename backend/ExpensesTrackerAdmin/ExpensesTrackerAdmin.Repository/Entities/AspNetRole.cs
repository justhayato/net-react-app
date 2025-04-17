using Microsoft.AspNetCore.Identity;

namespace ExpensesTrackerAdmin.Repository.Entities;

public partial class AspNetRole : IdentityRole<Guid>
{
    public DateTime? CreateDt { get; set; }

    public DateTime? UpdateDt { get; set; }
}
