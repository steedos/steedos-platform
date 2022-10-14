import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
  'react': '15.3 - 17',
  'react-dom': '15.3 - 17'
}, 'react-template-helper');

// const React = require('react');
// const ReactDOM = require('react-dom');
const React = React17;
const ReactDOM = ReactDOM17;

// Empty template; logic in `onRendered` below
Template.React = new Template("Template.React", function () { return []; });

Template.React.onRendered(function () {
  var parentTemplate = parentTemplateName();
  var container = this.firstNode.parentNode;
  this.container = container;

  this.autorun(function (c) {
    var data = Blaze.getData();

    var comp = data && data.component;
    if (! comp) {
      throw new Error(
        "In template \"" + parentTemplate + "\", call to `{{> React ... }}` missing " +
          "`component` argument.");
    }

    var props = _.omit(data, 'component');
    ReactDOM.render(React.createElement(comp, props), container);
  });
});

Template.React.onDestroyed(function () {
  if (this.container)
    ReactDOM.unmountComponentAtNode(this.container);
});

// Gets the name of the template inside of which this instance of `{{>
// React ...}}` is being used. Used to print more explicit error messages
function parentTemplateName () {
  var view = Blaze.getView();
  if (!view || view.name !== "Template.React")
    throw new Error("Unexpected: called outside of Template.React");

  // find the first parent view which is a template or body
  view = view.parentView;
  while (view) {
    var m;
    // check `view.name.match(/^Template\./)` because iron-router (and
    // maybe other packages) create a view named "yield" that has the
    // `template` property set
    if (view.template && view.name && (m = view.name.match(/^Template\.(.*)/))) {
      return m[1];
    } else if (view.name === "body") {
      return "<body>";
    }

    view = view.parentView;
  }

  // not sure when this could happen
  return "<unknown>";
};
