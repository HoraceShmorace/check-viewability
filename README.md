# checkViewability

A simple function that calculates whether a certain percentage of a specified HTML element is viewable with a given viewport (i.e., another HTML element, which itself must be viewable within the visible bounds of the current window).

## Usage
`checkViewability(CSSSelector||HTMLElement)`

**Example**
```
// Simple
checkViewability('#someElementId')
checkViewability('.any .css .selector > div')

// Passing element, percentage, and viewport
checkViewability('#someElementId', 75, '#someParentElementId')

// Passing element and viewport as object references to HTML elements
const element = document.querySelector('#someElementId')
const viewport = document.querySelector('#someParentElementId')
const minimumViewablePercentage = 90
checkViewability(element, minimumViewablePercentage, viewport)
```
## Use Case
Trigger a side effect once an element is in view. The demonstrated side effect injects text into the tracked element. Another example would be to inject an ad into the div only once the div is viewable.

```
window.addEventListener('scroll', () => {
    window.isScrolling = true
})

const trackViewability = selector => Array.isArray(window.elementsToTrack) 
  ? window.elementsToTrack.push(selector)
  : window.elementsToTrack = [selector]

const scrollChecker = setInterval(() => {
  if (!window.isScrolling) return
   
  window.isScrolling = false
  
  window.elementsToTrack.forEach(selector => {
    const elIsViewable = checkViewability(selector) // imported into the pen in JS Settings
    
    window.requestAnimationFrame(() => {
      const el = document.querySelector(selector)
      el.innerText = elIsViewable ? 'VIEWABLE!': 'not viewable'      
    })
  })
}, 200)

trackViewability('#el1')
```
