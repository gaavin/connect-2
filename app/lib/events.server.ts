import { AppLoadContext } from "@remix-run/cloudflare";
import { EventEmitter } from "node:events";
import debugFactory from "debug";

const debug = debugFactory("app:lib:events.server");
const eventEmitter = new EventEmitter();

const eventHandlers = {
  onLoadContextReady: async (appLoadContext: AppLoadContext) => {},
} as const;

type Event = typeof eventHandlers;
type EventName = keyof Event;
type EventHandler = Event[EventName];

export function emitEvent<
  TEventName extends EventName,
  TEventHandler extends EventHandler
>(eventName: TEventName, args: Parameters<TEventHandler>) {
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

Object.keys(eventHandlers).map((eventName) => {
  const eventHandler = eventHandlers[eventName as EventName];
  debug(
    `💎 Registering event handler ${eventHandler.toString()} for ${eventName}`
  );
  eventEmitter.on(eventName, eventHandler);
});