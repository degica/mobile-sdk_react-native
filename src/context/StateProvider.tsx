import { ReactNode, useReducer } from 'react';

import { DispatchContext, StateContext, reducer } from './state';

import { initialState } from '../util/types';

/**
 * StateProvider component to provide state and dispatch contexts to its children.
 * @param {object} props - The props for the StateProvider component.
 * @param {ReactNode | ReactNode[]} [props.children] - The children components to be wrapped by the provider.
 * @returns {JSX.Element} The StateProvider component.
 */

const StateProvider = ({
  children,
}: {
  children?: ReactNode | ReactNode[];
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch as any}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export default StateProvider;
