import { useEffect, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { signalRActions } from "./signalRMiddleware";
import type { AppDispatch } from "./store";

interface SignalRProviderProps {
  children: ReactNode;
}

export function SignalRProvider({ children }: SignalRProviderProps) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(signalRActions.start());

    return () => {
      dispatch(signalRActions.stop());
    };
  }, [dispatch]);

  return <>{children}</>;
}
