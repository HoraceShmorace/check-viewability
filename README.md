# nowyouseeme

A simple vanilla JavaScript utility that watches for changes in the viewability of a specified list of elements, at a set interval, in a given viewport (i.e., another HTML element, which itself must be viewable within the visible bounds of the current window).

Rather than responding directly to browser events, `nowyouseeme` uses a `setInterval` timer, which is more performant.

## Usage
```
// Create a watcher
const watcher = nowyouseeme(interval)

// Trigger viewability checks when the window scroll
window.addEventListener('scroll', watcher.check)

// Track a specific HTML element
watcher.track(options)

// Start the watcher
watcher.watch()
```

## API
To create a watcher, call `nowyouseeme` passing the number of seconds between each checking interval.
```
const watcher = nowyouseeme(200)
```

The returned watcher is an API of functions for configuring and controlling viewability tracking on specified HTML elements.

| function | description |
|----------|-------------|
| `[watcher].track(options)` | Configures viewability tracking for a single HTML element. |
| `[watcher].check()` | Sets an internal flag informs the interval timer that a viewability change might have occured. Intended primarily to be used as a callback for `window`'s `scroll`, `resize`, and `load` events. |
| `[watcher].watch()` | Starts the interval timer to watch for changes to the viewability of the specified HTML elements. |
| `[watcher].stop()` | Stops the interval timer so that changes to the viewability of the specified HTML elements are no longer watched. Ideal for when you've been tracking a DOM element rendered by a React component, but now the component is unmounting. |


### \[watcher].track Options
An object with properties to configure viewability tracking for a single HTML element.

| property | type | default | description |
|----------|------|---------|-------------|
| element | String or Object | None. Required. | A CSS selector selector, or a reference to an HTMLElement object. |
| viewport | String or Object | `document.body` | A CSS selector selector, or a reference to an HTMLElement object. |
| onViewable | Function | None. Required. | a function to call after the element becomes viewable |
| onNotViewable | Function | `noop` | a function to call after the element becomes not viewable |
| percentage | Number | 50 | a numeric value from 1-100 indicating the minimum visible area of the element to consider viewable. |

## Usage
Trigger a side effect once an element is in view, and another when it is not in view. The demonstrated side effects inject text into the tracked element. Another example would be to inject an ad into an element only once the element is viewable.

```
<script>
const watcher = nowyouseeme(100)

window.addEventListener('load', watcher.check)
window.addEventListener('scroll', watcher.check)
window.addEventListener('resize', watcher.check)

watcher.track({
  element: '#trackme',
  viewport: '#container,
  onViewable: element => { element.innerText = 'VIEWABLE!' },
  onNotViewable: element => { element.innerText = 'not viewable until 75% visible' },
  percentage: 75
})

watcher.watch()
</script>
...
<div id="container">
  <div id="trackme" />
</div>
```
