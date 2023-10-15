import React, { useState, useEffect } from "react";
import {
  JSONCodec,
  connect,
  JetStreamClient,
  AckPolicy,
  DeliverPolicy,
  JetStreamManager,
  ConsumerConfig,
  ReplayPolicy,
  RetentionPolicy,
  consumerOpts,
} from "nats.ws";
import NATSContext from "./NATSContext";
import { ALL_SUBJECT, STREAM_NAME } from "../../utils/constant";

interface NATSProviderProps {
  children: React.ReactNode;
}

const NATSProvider: React.FC<NATSProviderProps> = ({ children }) => {
  const [js, setJs] = useState<JetStreamClient | null>(null);
  const [jsm, setJsm] = useState<JetStreamManager | null>(null);
  const jc = JSONCodec();

  useEffect(() => {
    async function initializeNATS() {
      try {
        const localNc = await connect({
          servers: process.env.REACT_APP_NATS_SERVER,
        });
        const jsm = await localNc.jetstreamManager();
        const doesStreamExist = await jsm.streams
          .info(STREAM_NAME)
          .catch(() => null);
        if (!doesStreamExist) {
          await jsm.streams.add({
            name: STREAM_NAME,
            subjects: [ALL_SUBJECT],
            retention: RetentionPolicy.Limits,
          });
        }
        const localJs = localNc.jetstream();
        setJs(localJs);
        setJsm(jsm);
      } catch (error) {
        console.error("NATS Initialization Error:", error);
      }
    }
    initializeNATS();
  }, []);

  const publish = async (subject: string, data: any) => {
    if (js) {
      const encodedData = jc.encode(data);
      await js.publish(subject, encodedData);
    }
  };

  const subscribe = async (subject: string, callback: (data: any) => void) => {
    if (js) {
      const opts = consumerOpts();
      opts.orderedConsumer();
      const localSub = await js.subscribe(subject, opts);

      for await (const msg of localSub) {
        const decodedData = jc.decode(msg.data);
        callback(decodedData);
        msg.ack();
      }
      return localSub;
    }
  };

  const consume = async (
    durableName: string,
    subject: string,
    callback: (data: any) => void
  ) => {
    if (js && jsm) {
      // Add consumer
      const consumerConfig: ConsumerConfig = {
        durable_name: durableName,
        filter_subject: subject,
        deliver_policy: DeliverPolicy.All,
        ack_policy: AckPolicy.Explicit,
        replay_policy: ReplayPolicy.Instant,
      };
      try {
        await jsm.consumers.add(STREAM_NAME, consumerConfig);
      } catch (err: any) {
        if (err.code === "JS_CONSUMER_NAME_ALREADY_EXISTS") {
          const consumerInfo = await jsm.consumers.info(
            STREAM_NAME,
            durableName
          );
          console.log("consumer already exist", consumerInfo);
        } else {
          console.error("Failed to create or fetch consumer:", err);
        }
      }
      const consumer = await js.consumers.get(STREAM_NAME, durableName);
      const messages = await consumer.consume();

      console.log(messages);

      for await (const msg of messages) {
        console.log(`Received message: ${msg.seq} - ${msg.data}`);
        const decodedData = jc.decode(msg.data);
        callback(decodedData);
        msg.ack();
      }
      return consumer;
    }
  };

  return (
    <NATSContext.Provider value={{ publish, subscribe, consume }}>
      {children}
    </NATSContext.Provider>
  );
};

export default NATSProvider;
