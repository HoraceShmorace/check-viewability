# checkViewability

A simple function that calculates whether a certain percentage of a specified HTML element is viewable with a given viewport (i.e., another HTML element, which itself must be viewable within the visible bounds of the current window).

## Usage
`checkViewability(CSSSelector||HTMLElement)`

**Example**
```
checkViewability('#someElementId')
checkViewability('.any .css .selector > div')
checkViewability('#someElementId', 75, '#someParentElementId')

const element = document.querySelector('#someElementId')
const viewport = document.querySelector('#someParentElementId')
const minimumViewablePercentage = 90
checkViewability(element, minimumViewablePercentage, viewport)
```
