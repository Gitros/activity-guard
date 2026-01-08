using ActivityGuard.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using ActivityGuard.Application;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddDbContext<ActivityGuardDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddApplication();

builder.Services.AddControllers();

var app = builder.Build();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();
app.MapControllers();

app.Run();
