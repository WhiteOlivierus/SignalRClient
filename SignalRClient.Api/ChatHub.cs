using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using SignalRClient.Shared;

namespace SignalRClient.Api
{
    public class ChatHub : Hub<IChatReceiver>, IChatHub
    {
        private static readonly ConcurrentDictionary<string, string> UserNames = new();
        private readonly ILogger _logger;

        public ChatHub(ILogger<ChatHub> logger) => _logger = logger;

        public Task<IEnumerable<string>> GetParticipants()
        {
            _logger.Log(LogLevel.Information, "{id}: Invoke GetParticipants", Context.ConnectionId);
            return Task.FromResult(UserNames.Values as IEnumerable<string>);
        }

        public Task Join(string username)
        {
            _logger.Log(LogLevel.Information, "{id}: Invoke Join", Context.ConnectionId);

            UserNames[Context.ConnectionId] = username;
            Clients.All.OnJoin(username, DateTime.Now);
            return Task.CompletedTask;
        }

        public async Task Leave()
        {
            _logger.Log(LogLevel.Information, "{id}: Invoke Leave", Context.ConnectionId);

            string id = Context.ConnectionId;
            string username = UserNames[id];

            if (UserNames.TryRemove(id, out string? _))
            {
                await Clients.All.OnLeave(username, DateTime.Now);
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _logger.Log(LogLevel.Information, "{id}: Invoke OnDisconnectedAsync", Context.ConnectionId);

            if (UserNames.TryRemove(Context.ConnectionId, out string? username))
            {
                await Clients.All.OnLeave(username, DateTime.Now);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string message)
        {
            _logger.Log(LogLevel.Information, "{id}: Invoke SendMessage", Context.ConnectionId);

            string username = UserNames[Context.ConnectionId];
            await Clients.All.OnReceiveMessage(new Message(username, message, DateTime.Now));
        }
    }
}