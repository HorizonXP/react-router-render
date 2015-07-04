react-router-render
============

Handles the simple use case of importing a component and rendering it to markup via react-router.


Installation
------------

```javascript
npm install react-router-render
```


Usage
-----

```javascript
var reactRouterRender = require('react-router-render');

reactRouterRender({

  // An absolute path to a module exporting your component
  path: '/abs/path/to/component.js',
  
  // The URL you are currently trying to render
  location: '/',

  // Optional
  // --------

  // A string containing a JSON-serialized object which will be used
  // during rendering
  serialisedProps: '...',

  // An object which will be used during rendering
  props: {},

  // A flag indicating if you wish to render the component to static
  // markup. Defaults to false.
  toStaticMarkup: true

}, function(err, markup) {
  if (err) throw err;

  console.log(markup);
});
```
