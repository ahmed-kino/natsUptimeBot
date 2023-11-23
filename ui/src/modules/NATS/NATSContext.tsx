import { Consumer, JetStreamSubscription } from "nats.ws";
import { createContext, useContext } from "react";

type NATSContextType = {
  publish: (subject: string, data: any) => void;
  subscribe: (
    subject: string,
    callback: (data: any) => void
  ) => Promise<JetStreamSubscription | undefined>;
  consume: (
    durableName: string,
    subject: string,
    callback: (data: any) => void
  ) => Promise<Consumer | undefined>;
};

const NATSContext = createContext<NATSContextType | undefined>(undefined);

export const useNATS = () => {
  const context = useContext(NATSContext);
  if (!context) {
    throw new Error("useNATS must be used within a NATSProvider");
  }
  return context;
};

export default NATSContext;
