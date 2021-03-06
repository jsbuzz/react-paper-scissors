import Control from "./control";
import { AllEvents } from "./event";
import { EventPool } from "./event-pool";

export class EventGateway {
  constructor() {
    this.eventPool = new EventPool();
  }

  // trigger event after current execution ended
  trigger(hiveEvent) {
    if (hiveEvent.withAlias) {
      hiveEvent = new hiveEvent();
    }
    const actor = Control.actor;
    const promise = new Promise((resolve) =>
      global.setTimeout(() => resolve(this.triggerSync(hiveEvent, actor)), 0)
    );
    hiveEvent._promise = promise;

    return promise;
  }

  // trigger event within current execution stack
  triggerSync(hiveEvent, actor = null) {
    if (hiveEvent.withAlias) {
      hiveEvent = new hiveEvent();
    }
    actor && (Control.actor = actor);
    hiveEvent._origin || (hiveEvent._origin = this);
    hiveEvent._gateway = this;

    Control.logTriggerSync(hiveEvent, this);
    return this.eventPool.dispatchEvent(hiveEvent);
  }

  listen(...listeners) {
    listeners.reduce((events, current) => {
      if (!current.EventName) {
        events.forEach((e) => this.addEventListener(e, current));
        return [];
      }
      return [...events, current];
    }, []);
  }

  addEventListener(fiberEvent, eventHandler, prepend = false) {
    if (fiberEvent === AllEvents) {
      this.eventPool.addGlobalListener(eventHandler, prepend);
    } else {
      this.eventPool.addEventListener(
        fiberEvent.EventName,
        eventHandler,
        prepend
      );
    }

    Control.registerListener(
      this.eventPool,
      fiberEvent.EventName,
      eventHandler
    );
  }
}
