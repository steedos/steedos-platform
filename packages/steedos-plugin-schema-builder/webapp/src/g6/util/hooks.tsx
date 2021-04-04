import Immer from 'immer';
import { useCallback, useReducer } from 'react';

const _createReducer = command => {
  return (state, {
    type,
    ...data
  }) => {
    const immer = Immer(state, s => {
      if (command[type]) {
        command[type](state, {
          type,
          ...data
        });
      }
    });
    return immer;
  };
};

export const useImmerReducer = (commands, stateInit) => {
  const createReducerCallback = useCallback(() => {
    return _createReducer(commands);
  }, [commands]);
  return useReducer(createReducerCallback, stateInit);
};