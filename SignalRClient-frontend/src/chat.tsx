import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { signalRActions } from "./signalRMiddleware";

export function Chat() {
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((s: RootState) => s.chat.messages);
  const participants = useSelector((s: RootState) => s.chat.participants);

  const handleJoin = () => {
    dispatch(signalRActions.join({ username: "bas" }));
  };

  const loadParticipants = async () => {
    const result = await dispatch(signalRActions.getParticipants());
    if (result.payload) {
      dispatch({ type: "chat/setParticipants", payload: result.payload });
    }
  };

  return (
    <div>
      <button onClick={handleJoin}>Join</button>
      <button onClick={loadParticipants}>Load participants</button>
      <div>
        <h4>Participants</h4>
        <ul>
          {participants.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Messages</h4>
        <ul>
          {messages.map((m, i) => (
            <li key={i}>{m.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
