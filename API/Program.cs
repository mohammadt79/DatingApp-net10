using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
   options.AddPolicy("AllowAngularDev", policy =>
   {
      policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
             .AllowAnyHeader()
             .AllowAnyMethod();
   });
});

builder.Services.AddDbContext<DataContext>(opt =>
{
   opt.UseSqlite(builder.Configuration.GetConnectionString("Defaultconnection"));
});

builder.Services.AddScoped<ITokenService, TokenService>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }

// app.UseHttpsRedirection();

// app.UseAuthorization();

app.UseCors("AllowAngularDev");
app.MapControllers();

app.Run();
