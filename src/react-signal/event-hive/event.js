import Control from "./control";

let eventId = 0;

export const AllEvents = { EventName: "::AllEvents::" };

export class Event {
  constructor() {
    this.name = this.constructor.EventName;
  }

  cancel() {
    Control.logEventCancelled(this);
    this.__cancelled = true;
  }

  static alias(name) {
    this.EventName = name;
    return this;
  }

  static withAlias(name) {
    return defineEvent(this, name);
  }

  static with(...params) {
    return new this(...params);
  }
}

export function basicEvent(name) {
  return class extends Event {}.alias(name || `Event${++eventId}`);
}

export function defineEvent(EventType, name) {
  return class extends EventType {}.alias(name || `Event${++eventId}`);
}
