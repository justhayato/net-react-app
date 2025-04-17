namespace ExpensesTrackerAdmin.WebAPI.Middlewares
{
    /// <summary>
    /// Middleware for logging requests with custom Correlation ID.
    /// </summary>
    public class LoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private ILogger<LoggingMiddleware> _logger;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="next"></param>
        /// <param name="logger"></param>
        public LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        /// <summary>
        /// Logging function
        /// </summary>
        /// <param name="httpContext"></param>
        /// <returns></returns>
        public async Task Invoke(HttpContext httpContext)
        {
            using (_logger.BeginScope("CorrelationID: {CorrelationID}", Guid.NewGuid()))
            {
                _logger.LogInformation("{RequestMethod} {RequestPath}, Request received.", httpContext.Request.Method, httpContext.Request.Path);

                await _next(httpContext);

                _logger.LogInformation("{RequestMethod} {RequestPath}, Request processing completed.", httpContext.Request.Method, httpContext.Request.Path);
            }
        }
    }

    /// <summary>
    /// Extension Method
    /// </summary>
    public static class LoggingMiddlewareMiddlewareExtensions
    {
        /// <summary>
        /// Extension Method
        /// </summary>
        public static IApplicationBuilder UseLoggingMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<LoggingMiddleware>();
        }
    }
}
