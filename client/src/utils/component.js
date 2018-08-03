/* eslint
import/prefer-default-export: 0
*/

import _ from 'lodash';

export const connectStateStorage = (componentInstance, options) => {
  const defaultOptions = {
    storage: sessionStorage,
    storageKey: `${componentInstance.constructor.displayName}.state`,
    stateKeys: [],
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  const {
    storage,
    storageKey,
    stateKeys,
  } = mergedOptions;

  const restoreState = () => {
    try {
      return JSON.parse(storage.getItem(storageKey));
    } catch (ex) {
      return undefined;
    }
  };

  const storeState = (state) => {
    const stateToStore = _.isEmpty(stateKeys) ? state : _.pick(state, stateKeys);
    storage.setItem(storageKey, JSON.stringify(stateToStore));
  };

  componentInstance.state = {
    ...componentInstance.state,
    ...restoreState(),
  };

  const setState = componentInstance.setState.bind(componentInstance);
  componentInstance.setState = (stateChange, callback = () => {}) => {
    setState(stateChange, () => {
      callback();
      storeState(componentInstance.state);
    })
  };
};

export const getPassThroughProps = (componentInstance) => {
  const {
    props,
    constructor: {
      propTypes,
    },
  } = componentInstance;
  return _.omit(props, _.keys(propTypes));
};
