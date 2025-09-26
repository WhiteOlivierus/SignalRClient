using Tapper;

namespace SignalRClient.Shared
{
    [TranspilationSource]
    public record Message(string Username, string Content, DateTime TimeStamp);
}