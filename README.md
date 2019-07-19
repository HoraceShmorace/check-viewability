# checkViewability

A simple vanilla JavaScript function that calculates whether a certain percentage of a specified HTML element is viewable within a given viewport (i.e., another HTML element, which itself must be viewable within the visible bounds of the current window).

## Usage
`checkViewability(selector[, percentage[, viewport[, beVerbose]]])`

### Arguments
| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| selector | CSSSelector or HTMLElement | None, Required | Either a valid CSS selector or an object reference to an HTML element who's viewability will be measured. |
| percentage | Number | 50 | The percentage of the selected element that must be visible in the given viewport to be considered viewable. |
| viewport | CSSSelector or HTMLElement | document.body | Either a valid CSS selector or an object reference to an HTML element. |
| beVerbose | Boolean | false | When false, the return value will be a boolean indicating whether the specified element is viewable. When true, the return value will be an object containing properties about the element, including whether it is viewable. |

### Example
```
// Simple
checkViewability('#someElementId')
checkViewability('.any .css .selector > div')

// Passing element, percentage, and viewport
checkViewability('#someElementId', 75, '#someParentElementId')

// Passing element and viewport as object references to HTML elements
const element = document.querySelector('#someElementId')
const viewport = document.getElementById('someParentElementId')
const minimumViewablePercentage = 90
checkViewability(element, minimumViewablePercentage, viewport)
```
## Use Case
Trigger a side effect once an element is in view. The demonstrated side effect injects text into the tracked element. Another example would be to inject an ad into a div only once the div is viewable.

```
const handler = () => { window.doViewabilityCheck = true }

window.addEventListener('scroll', handler)
window.addEventListener('resize', handler)

const scrollChecker = setInterval(() => {
  if (!window.doViewabilityCheck) return
  
  window.doViewabilityCheck = false

  window.elementsToTrack.forEach(selector => window.requestAnimationFrame(() => {
    const elIsViewable = checkViewability(selector) // imported into the pen in JS Settings
    const el = document.querySelector(selector)

    // Do a DOM side effect
    el.innerText = elIsViewable ? 'VIEWABLE!': 'not viewable'

    // Another use case would be to display an add in the div only once it's viewable.
    // googletag.display("el1");

  }))
}, 200)

const trackViewability = selector => Array.isArray(window.elementsToTrack) 
  ? window.elementsToTrack.push(selector)
  : window.elementsToTrack = [selector]

trackViewability('#el1')
```
