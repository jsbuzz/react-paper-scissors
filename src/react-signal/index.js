import React, { PureComponent } from "react";

import Control from "./event-hive/control";
import StateConnector from "./connect/StateConnector";
import { AllEvents } from "./event-hive/event";
import { RootNameSpace } from "./event-hive/namespace";

export { AllEvents };

export const NamespaceCtx = React.createContext();

export const getOrigin = (event) => event._origin;

// what's better for this usecase, composition or inheritence?
const connectComponent = (ComponentClass) =>
  class extends ComponentClass {
    on = (ns) => Control.withActor(this, ns);

    namespace = () => Control.withActor(this, this.props.namespace);

    componentDidMount(...stuff) {
      super.componentDidMount && super.componentDidMount(...stuff);

      this.listen && this.listen();
      this.displayName = ComponentClass.name;
    }

    componentWillUnmount(...stuff) {
      super.componentWillUnmount && super.componentWillUnmount(...stuff);
      Control.cleanup(this);
    }
  };

const connectFunction = (fn, namespace, events) => (props) =>
  fn(props, (ns) => {
    ns || (ns = props.namespace);
    return Control.withActor(fn, ns);
  });

const Connect = (
  component,
  selector = null,
  events = null,
  namespace = null
) => {
  let ConnectedComponent = Enable(component);

  if (selector) {
    ConnectedComponent = StateConnector(
      namespace,
      selector,
      events,
      ConnectedComponent
    );
  }

  const HiveComponent = (props) => (
    <NamespaceCtx.Consumer>
      {(ctx) => (
        <ConnectedComponent
          {...props}
          namespace={ctx || props.namespace || RootNameSpace}
        />
      )}
    </NamespaceCtx.Consumer>
  );
  HiveComponent.displayName = `~${ConnectedComponent.displayName}`;

  return HiveComponent;
};

export const Enable = (component) => {
  let ConnectedComponent =
    component.prototype && component.prototype.render
      ? connectComponent(component)
      : connectFunction(component.type || component);

  ConnectedComponent.displayName = component.name;

  return ConnectedComponent;
};

export default Connect;

export const Signal = (connectorFn) => {
  return (renderFn) => {
    const SignalComponent = class extends PureComponent {
      componentDidMount() {
        const { namespace } = this.props;

        const listeners = connectorFn(
          // get:
          (key) => {
            const values = {
              ...this.props,
              ...this.state,
            };

            return key !== undefined ? values[key] : values;
          },

          // set:
          (state) => this.setState(state)
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
            ...this.state,
          },
          () => Control.withActor(this, this.props.namespace)
        );
      }

      state = {};
      displayName = `~${renderFn.name}`;
    };
    SignalComponent.displayName = `~$${renderFn.name}`;

    const componentFn = (props) => (
      <NamespaceCtx.Consumer>
        {(ctx) => (
          <SignalComponent
            {...props}
            namespace={ctx || props.namespace || RootNameSpace}
          />
        )}
      </NamespaceCtx.Consumer>
    );
    componentFn.displayName = `~${renderFn.name}`;
    return componentFn;
  };
};
