using TypedSignalR.Client;

namespace SignalRClient.Shared
{
    [Hub]
    public interface IChatHub
    {
        Task<IEnumerable<string>> GetParticipants();
        Task Join(string username);
        Task Leave();
        Task SendMessage(string message);
    }
}