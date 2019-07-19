/**
 * Determines whether a certain percentage of a specified element is viewable with a given viewport.
 *   By default, it will check if the specified element is at least 50% viewable in `document.body`.
 *
 * @param {String or Object} selector Either a valid CSS selector or an HTML object reference
 *   to the element who's viewability will be measured.
 * @param {Number} [percentage=50] The percentage of the selected element that must be visible
 *   in the given viewport to be considered viewable.
 * @param {String or Object} [viewport=document.body] Either a valid CSS selector or an object 
 *   reference to an HTML element
 * @returns {Boolean}
 */
const checkViewability = function(selector, percentage = 50, viewport = document.body) {
  const ERROR_MSG = 'Visibility Checker: Invalid selector passed.'
  const { max, min, round } = Math
  
  const selectElement = selector => {
    switch (typeof selector) {
      case 'string':
        return document.querySelector(selector) || throw ERROR_MSG
        break;
      case 'object':
        return selector
      default:
        throw ERROR_MSG
        return null
    }
  } 

  const element = selectElement(selector)
  
  if (!element) return false

  const {
    x: elL,
    y: elT,
    width: elW,
    height: elH,
  } = element.getBoundingClientRect()
  const elR = elL + elW
  const elB = elT + elH
  const elementArea = elW * elH
  const { display, visibility, opacity } = getComputedStyle(element, null)
 
  if (display === 'none' || visibility === 'hidden' || opacity < 0.02 || elementArea < 1) return false;
                                                                     
  const viewportElement = selectElement(viewport)
  const {
    x: vpX,
    y: vpY,
    width: vpW,
    height: vpH,
  } = viewportElement.getBoundingClientRect()
  const vpT = max(vpX, 0)
  const vpL = max(vpY, 0)
  const vpR = min(vpL + vpW, window.innerWidth)
  const vpB = min(vpT + vpH, window.innerHeight)

  const minimumViewableArea = elementArea * percentage * 0.01
  const viewableLength = min(elR, vpR) - max(elL, vpL)
  const viewableWidth = min(elB, vpB) - max(elT, vpT)
  const viewableArea = max(0, viewableLength * viewableWidth)

  return viewableArea >= minimumViewableArea
}
