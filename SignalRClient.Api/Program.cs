using SignalRClient.Api;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddLogging();
builder.Services.AddCors();

WebApplication app = builder.Build();

app.UseCors(builder =>
{
    builder
        .SetIsOriginAllowed(_ => true)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
});

app.MapGet("/", () => "Hello world");

app.MapHub<ChatHub>("/hubs/chathub");

app.Run();