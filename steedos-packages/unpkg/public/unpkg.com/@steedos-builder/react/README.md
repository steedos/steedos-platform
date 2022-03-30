# Steedos Builder React SDK

See our [main readme](/README.md) for info on getting started with the React SDK

## React API

### BuilderComponent

#### Simple example

```tsx
// Render a matching Builder page for the given URl
<BuilderComponent model="page">
```

#### Passing content manually

```ts
const content = await builder.get('page', { ...options });
if (content) {
  document.title = content.data.title; // You can use custom fields from the response
  return <BuilderComponent model="page" content={content} >
}

```

#### Passing data and functions down

```tsx
<BuilderComponent
  model="page"
  data={{
    products: productsList,
    foo: 'bar'
  }} >
```

You can also pass down functions, complex data like custom objects and libraries you can use `context`. Similar to React context, context passes all the way down (e.g. through symbols, etc). This data is not observed for changes and mutations

```tsx
<BuilderComponent
  model="page"
  context={{
    addToCart: () => myService.addToCart(currentProduct),
    lodash: lodash,
  }} >
```

#### Passing complex

Everything passed down is available on the `state` object in data and actions - e.g. `state.products[0].name`

#### Advanced querying

```tsx
import { BuilderComponent, builder } from '@steedos-builder/react';

builder.setUserAttributes({ isLoggedIn: false })

export default () => <div>
  <BuilderComponent
     model="section"
     options={{ query: { 'data.something.$in': ['value a', 'value b'] } }} />
  <!-- some other content -->
</div>
```

#### contentLoaded

```tsx
<BuilderComponent
  model="page"
  contentLoaded={data => {
    document.title = data.title; // E.g. if your custom field is called `title`
  }}
/>
```

### Builder

The global `Builder` singleton has a number of uses. Most important is registering custom components.

```tsx
import * as React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { Builder } from "@steedos-builder/react";

class CodeBlockComponent extends React.Component {
  render() {
    return (
      <SyntaxHighlighter language={this.props.language}>
        {this.props.code}
      </SyntaxHighlighter>
    );
  }
}

Builder.registerComponent(CodeBlockComponent, {
  name: "Code Block",
  inputs: [
    {
      name: "code",
      type: "string",
      defaultValue: "const incr = num => num + 1"
    },
    {
      name: "language",
      type: "string",
      defaultValue: "javascript"
    }
  ]
});
```

### BuilderContent

#### Usage with Data Models

##### Example, setting up an editable theme:

```tsx
 <BuilderContent model="site-settings"> { (data, loading) => {
   If (loading) {
     return <Spinner />
   }
   return <>
      /*pass values down to an example ThemeProvider, used as a wrapper in your application*/
       <ThemeProvider theme={data.theme} >
           {props.children}
       </ThemeProvider>
   </>
   }}
</BuilderContent>
```

#### Usage with Page/Section Custom Fields

##### Example, passing Custom Field input:

```tsx
<BuilderContent model="landing-page">
  {data => {
    /*use your data here within your custom component*/
    return (
      <>
        <FeaturedImage image={data.featuredImage} />
        <BuilderComponent content={content} model="landing-page" />
      </>
    );
  }}
</BuilderContent>
```

#### Passing content manually

```tsx
const content = await builder.get(‘your-data-model’, { ...options });
if (content) {
  /*use your data here*/
  return <BuilderContent model="your-data-model" content={content} >
}
```

#### Advanced querying

```tsx
import { BuilderContent, builder } from '@steedos-builder/react';

builder.setUserAttributes({ isLoggedIn: false })

export default () => <div>
  <BuilderContent
     model="your-data-model"
     options={{ query: { 'data.something.$in': ['value a', 'value b'] } }} />
  <!-- some other content -->
</div>
```

### builder

```tsx
import { builder } from "@steedos-builder/react";

builder.init(YOUR_KEY);

// Optional custom targeting
builder.setUserAttributes({
  userIsLoggedIn: true,
  whateverKey: "whatever value"
});
```
