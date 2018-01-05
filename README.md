# ObservableState

Javascript plugin for observe the object

## How to use (example)

```Javascript
// define of state object
var state = new ObservableState({
  counter: 0
});

// subscribe on change of property of state
// "this" === state
//
// for each change of "counter" property
// will be displayed current value of "counter" in browser console
// so we can observe the state
state.subscribe("counter", function () {

  console.log(this.get("counter"));

});

// for change the property you must
state.set("counter", 123);

// watch the history of change of state
// return array history of change
state.getHistory();


// so if set DEBUG_MODE in true, history of change
// will be constantly displayed in console of browser
state.DEBUG_MODE = true;


// unsubscribe from "counter" property of state
state.unsubscribe("counter");
```
