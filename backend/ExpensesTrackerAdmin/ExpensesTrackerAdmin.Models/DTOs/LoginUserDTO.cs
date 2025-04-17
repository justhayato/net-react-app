namespace ExpensesTrackerAdmin.Models.DTOs
{
    public class LoginUserDTO
    {
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public bool IsPersistent { get; set; }
    }
}
