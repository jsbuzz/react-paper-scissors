import {
  useContext,
  useEffect,
  useState,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
} from "react";
import { NamespaceCtx } from "./";
import { extractProps } from "./connect/util";
import Control from "./event-hive/control";
import { StateChanged } from "./event-hive/namespace";

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
    // eslint-disable-next-line
  }, []);

  return {
    trigger: (...a) => Control.withActor(instance, namespace).trigger(...a),
  };
}

export function useSelector(selectorFn) {
  const namespace = useContext(NamespaceCtx);
  const [state, refreshSelector] = useState(namespace.state);
  const watchedProps = extractProps(selectorFn);

  useListeners(StateChanged, () => {
    if (watchedProps) {
      for (let prop of watchedProps) {
        if (namespace._propsChanged[prop]) {
          refreshSelector({ ...namespace.state });
          return;
        }
      }
      return;
    }
    refreshSelector({ ...namespace.state });
  });

  return selectorFn(state);
}
