import { EventEmitter } from "node:events";
import debugFactory from "debug";
import { Diff } from "./utils";
import { QuirkedUpContext } from "./context.server";

const debug = debugFactory("app:lib:events.server");

// 🚀 Define event types here
type Event = {
  onContextChange: (diff: Diff<QuirkedUpContext>) => void;
  onRequest: (context: QuirkedUpContext) => void;
  onParsed: <TData>(data: TData) => void;
};

const eventEmitter = new EventEmitter();

type EventName = keyof Event;
type EventHandler = Event[EventName];

export function emitEvent<
  TEventName extends EventName,
  TEventHandler extends EventHandler
>(eventName: TEventName, ...args: Parameters<TEventHandler>) {
  eventEmitter.emit(eventName, args);
}

export async function onEvent<
  TEventName extends EventName,
  TEventHandler extends EventHandler
>(eventName: TEventName, eventHandler: TEventHandler) {
  return new Promise<TEventHandler | void>((resolve) => {
    eventEmitter.on(eventName, async (args) => {
      await eventHandler(args);
      resolve();
    });
  });
}
