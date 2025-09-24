import "./App.css";
import { Chat } from "./chat";
import { SignalRProvider } from "./chat-provider";

function App() {
  return (
    <SignalRProvider>
      <Chat />
    </SignalRProvider>
  );
}

export default App;
