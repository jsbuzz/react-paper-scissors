import React, { PureComponent } from "react";

import { NameSpace } from "./event-hive/namespace";
import * as testHooks from "./hooks";

export class TestNameSpace extends NameSpace {
  events = [];
  lastEvent = null;

  constructor(name, schema, parent) {
    super(
      name || "TestNameSpace",
      schema && schema.stateDefinition(),
      parent,
      false
    );
    this._sendStateUpdates = true;
  }

  trigger(event) {
    const promise = super.trigger(event);
    this.events.push(event);
    this.lastEvent = event;

    return promise;
  }

  reset() {
    this.events = [];
    this.lastEvent = null;
    this.namespaces = [];
    this.lastNamespace = null;
  }

  hasListenerFor(Event) {
    return this.eventPool.events.has(Event.EventName);
  }

  startService(Service) {
    const service = new Service(this);
    service.listen();

    return service;
  }

  // Signal(LastOperationListeners)(LastOperation);
  addSignal(connectorFn) {
    const NS = this;
    return renderFn => {
      const SignalComponent = class extends PureComponent {
        componentDidMount() {
          const { namespace } = this.props;

          const listeners = connectorFn(
            state => this.setState(state),
            key => {
              const values = {
                ...this.props,
                ...this.state
              };

              return key !== undefined ? values[key] : values;
            }
          );
          Control.withActor(this, namespace).listen(...listeners);
        }

        componentWillUnmount() {
          Control.cleanup(this);
        }

        render() {
          return renderFn(
            {
              ...this.props,
              ...this.state
            },
            () => Control.withActor(this, this.props.namespace)
          );
        }

        state = {};
        displayName = `~${renderFn.name}`;
      };
      SignalComponent.displayName = `~$${renderFn.name}`;

      const componentFn = props => (
        <SignalComponent {...props} namespace={NS} />
      );
      componentFn.displayName = `~${renderFn.name}`;
      return componentFn;
    };
  }
}

export const connectFunction = (fn, NS = new TestNameSpace()) => props =>
  fn(props, ns => ns || NS);

export const connectComponent = (ComponentClass, NS = new TestNameSpace()) =>
  class extends ComponentClass {
    namespace = ns => ns || NS;
  };

const Connect = (component, NS) => {
  let ConnectedComponent =
    component.prototype && component.prototype.render
      ? connectComponent(component, NS)
      : connectFunction(component.type || component, NS);

  ConnectedComponent.displayName = component.name;

  return ConnectedComponent;
};

export default Connect;

export const Signal = connectorFn => {
  return renderFn => {
    const SignalComponent = class extends PureComponent {
      componentDidMount() {
        const { namespace } = this.props;

        const listeners = connectorFn(
          state => this.setState(state),
          key => {
            const values = {
              ...this.props,
              ...this.state
            };

            return key !== undefined ? values[key] : values;
          }
        );
        Control.withActor(this, namespace).listen(...listeners);
      }

      componentWillUnmount() {
        Control.cleanup(this);
      }

      render() {
        return renderFn(
          {
            ...this.props,
            ...this.state
          },
          () => Control.withActor(this, this.props.namespace)
        );
      }

      state = {};
      displayName = `~${renderFn.name}`;
    };
    SignalComponent.displayName = `~$${renderFn.name}`;

    const componentFn = props => (
      <NamespaceCtx.Consumer>
        {ctx => (
          <SignalComponent {...props} namespace={ctx || props.namespace} />
        )}
      </NamespaceCtx.Consumer>
    );
    componentFn.displayName = `~${renderFn.name}`;
    return componentFn;
  };
};

export const useTestNamespace = NS => {
  jest.spyOn(testHooks, "useNamespace").mockImplementation(() => ({
    trigger: (...a) => NS.trigger(...a)
  }));
};
