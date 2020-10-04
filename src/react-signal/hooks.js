import {
  useContext,
  useEffect,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
} from "react";
import { NamespaceCtx } from "./";
import Control from "./event-hive/control";

const getInstance = () => {
  const __fiberNode =
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner
      .current;

  return {
    __fiberNode,
    name: __fiberNode.type.displayName || __fiberNode.type.name,
    __listeners: [],
  };
};

export function useNamespace() {
  const namespace = useContext(NamespaceCtx);
  const instance = getInstance();

  return {
    trigger: (...a) => Control.withActor(instance, namespace).trigger(...a),
    state: namespace.state,
  };
}

export function useListeners(...listeners) {
  const namespace = useContext(NamespaceCtx);
  const instance = getInstance();

  useEffect(() => {
    Control.withActor(instance, namespace).listen(...listeners);

    return function cleanup() {
      Control.cleanup(instance);
    };
  }, [instance, namespace, listeners]);

  return {
    trigger: (...a) => Control.withActor(instance, namespace).trigger(...a),
  };
}
