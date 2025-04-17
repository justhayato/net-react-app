using Microsoft.AspNetCore.Mvc;

namespace ExpensesTrackerAdmin.WebAPI.Controllers
{
    /// <summary>
    /// Custom Base Controller for WebAPI
    /// </summary>
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class CustomBaseController : ControllerBase
    {
        
    }
}
