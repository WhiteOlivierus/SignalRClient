using TypedSignalR.Client;

namespace SignalRClient.Shared
{
    [Receiver]
    public interface IChatReceiver
    {
        Task OnJoin(string username, DateTime dateTime);

        Task OnLeave(string username, DateTime dateTime);

        Task OnReceiveMessage(Message message);
    }
}