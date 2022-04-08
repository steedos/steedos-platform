Lets you easily include React components in Meteor templates. Pass the
component class through the `component` argument.

Examples:

```html
<template name="Dropdown">
  <div>
    {{> React component=dropdown options=options value=selected onChange=onChange}}
  </div>
</template>
```

```js
Template.Dropdown.onCreated(function () {
  this.state = new ReactiveDict;
  this.state.set("selected", null);
});

Template.Dropdown.helpers({
  dropdown: function () {
    // Assuming this is https://github.com/fraserxu/react-dropdown, loaded
    // elsewhere in the project.
    return Dropdown;
  },
  options: [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' },
    {
      type: 'group', name: 'group1', items: [
        { value: 'three', label: 'Three' },
        { value: 'four', label: 'Four' }
      ]
    }
  ],
  selected: function () {
    return Template.instance().state.get("selected");
  },
  onChange: function () {
    var tmpl = Template.instance();
    return function (option) {
      tmpl.state.set("selected", option);
    }
  }
});
```

Check out [the React article](http://guide.meteor.com/react.html) in the Meteor Guide to learn how to use Meteor and React together to build awesome apps.
