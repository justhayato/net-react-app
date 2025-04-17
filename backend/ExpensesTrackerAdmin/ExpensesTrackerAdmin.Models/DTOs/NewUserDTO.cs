using ExpensesTrackerAdmin.Models.Enums;

namespace ExpensesTrackerAdmin.Models.DTOs
{
    public class NewUserDTO
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Password { get; set; }
        public AppUserRoles Role { get; set; }
    }
}
