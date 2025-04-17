using Asp.Versioning;
using ExpensesTrackerAdmin.Repository.Entities;
using ExpensesTrackerAdmin.Services;
using ExpensesTrackerAdmin.Services.Interfaces;
using ExpensesTrackerAdmin.WebAPI.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text;

namespace ExpensesTrackerAdmin
{
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    public class Program
    {
        public static void Main(string[] args)
        {
            // Configure Filters
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllers(options =>
            {
                options.Filters.Add(new ProducesAttribute("application/json"));
                options.Filters.Add(new ConsumesAttribute("application/json"));

                // Add Authorize Attribute to Controllers
                var authorizePolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                options.Filters.Add(new AuthorizeFilter(authorizePolicy));
            });

            // Configure Services
            builder.Services.AddTransient<IUserService, UserService>();
            builder.Services.AddTransient<IAccountService, AccountService>();
            builder.Services.AddTransient<IJwtService, JwtService>();

            // Configure DbContext
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            // Configure Identity
            builder.Services.AddIdentity<AspNetUser, AspNetRole>()
                            .AddEntityFrameworkStores<ApplicationDbContext>()
                            .AddDefaultTokenProviders();

            // Configure Logger
            builder.Host.UseSerilog((HostBuilderContext context, IServiceProvider services, LoggerConfiguration loggerConfiguration) =>
            {
                loggerConfiguration.ReadFrom.Configuration(context.Configuration).ReadFrom.Services(services);
            });

            // Configure Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddApiVersioning(config =>
            {
                config.ApiVersionReader = new UrlSegmentApiVersionReader();
                config.DefaultApiVersion = new ApiVersion(1, 0);
                config.AssumeDefaultVersionWhenUnspecified = true;
            })
            .AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'VVV";
                options.SubstituteApiVersionInUrl = true;
            });

            builder.Services.AddSwaggerGen(options =>
            {
                var xmlFilename = Path.Combine(AppContext.BaseDirectory, "api.xml");
                options.IncludeXmlComments(xmlFilename);

                options.SwaggerDoc("v1", new OpenApiInfo() { Title = "ExpensesTracker-Admin API", Version = "1.0" });
                options.SwaggerDoc("v2", new OpenApiInfo() { Title = "ExpensesTracker-Admin API", Version = "2.0" });
            });

            // Configure CORS
            builder.Services.AddCors(options =>
            {
                // DEFAULT
                options.AddDefaultPolicy(policyBuilder =>
                {
                    // allowed origins
                    policyBuilder.WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>());
                    // allowed headers in the request
                    policyBuilder.WithHeaders("authorization", "accept", "content-type");
                    //policyBuilder.AllowAnyHeader();
                    // allowed methods
                    policyBuilder.WithMethods("GET", "POST", "PATCH", "DELETE");
                });
            });

            // Configure JWT Authentication
            builder.Services.AddAuthentication(options =>
            {
                // "Bearer" Authentication Scheme
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                // Configure Validation Rules for JWT
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true, // Issuer
                    ValidIssuer = builder.Configuration.GetSection("JWT").GetValue<string>("Issuer"),
                    ValidateAudience = true, // Audience
                    ValidAudience = builder.Configuration.GetSection("JWT").GetValue<string>("Audience"),
                    ValidateIssuerSigningKey = true, // Signature
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("JWT").GetValue<string>("SecretKey"))),
                    ValidateLifetime = true, // Expiration
                    ClockSkew = TimeSpan.Zero
                };
            });

            builder.Services.AddAuthorization();

            // Configure the HTTP request pipeline.
            var app = builder.Build();
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("v1/swagger.json", "version 1.0");
                    options.SwaggerEndpoint("v2/swagger.json", "version 2.0");
                });
            }
            app.UseHsts();
            app.UseHttpsRedirection();
            app.UseLoggingMiddleware();
            app.UseRouting();
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
}
