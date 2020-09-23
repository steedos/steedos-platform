(function (react, options, getState, states){
  let apps = states.visibleAppsSelector(getState());
  let names = apps.map(function (n) { return n.name });
  return react.createElement('div', null, `Hello ${options.label}, ${names}`);

  // const Card = require('@steedos/design-system-react').Card;
  // return react.createElement(Card, { heading: options.label }, `Hello ${options.label}, ${names}`);
});