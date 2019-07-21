# nowyouseeme

A simple vanilla JavaScript utility that allows for the tracking of the viewability of a specified list of elements, at a set interval, in a given viewport (i.e., another HTML element, which itself must be viewable within the visible bounds of the current window).

## Usage
```
const tracker = nowyouseeme(interval)
tracker.track(options)
```
### Options
A hash map of elements in which to track viewability, for which the key is the
| property | type | default | description |
|----------|------|---------|-------------|
| element | String or Object | None. Required. | a reference to the HTMLElement object of the element to track |
| viewport | String or Object | `document.body` | A CSS selector selector, or a reference to an HTMLElement object. |
| onViewable | Function | None. Required. | a function to call after the element becomes viewable |
| onNotViewable | Function | `noop` | a function to call after the element becomes not viewable |
| percentage | Number | 50 | a numeric value from 1-100 indicating the minimum visible area of the element to consider viewable. |

## Usage
Trigger a side effect once an element is in view, and another when it is not in view. The demonstrated side effects inject text into the tracked element. Another example would be to inject an ad into an element only once the element is viewable.

```
<script>
const tracker = nowyouseeme(100)

window.addEventListener('load', tracker.trigger)
window.addEventListener('scroll', tracker.trigger)
window.addEventListener('resize', tracker.trigger)

tracker.track({
  element: '#trackme',
  viewport: '#container,
  onViewable: element => { element.innerText = 'VIEWABLE!' },
  onNotViewable: element => { element.innerText = 'not viewable until 75% visible' },
  percentage: 75
})

tracker.watch()
</script>
...
<div id="container">
  <div id="trackme" />
</div>
```
