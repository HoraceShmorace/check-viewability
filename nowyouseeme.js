/**
 * Watches for changes in the viewability of a specified list of elements, at a set interval, within a given viewport.
 * @param {Number} interval Number indicating how often in milliseconds to check viewability of elements.
 * @returns {Object} An API of functions for configuring and controlling viewability tracking.
 */
const nowyouseeme = (interval = 200, autoWatch = true) => {
  const MINIMUM_VIEWABLE_OPACITY = 0.02
  const MINIMUM_VIEWABLE_AREA = 1
  const NON_VIEWABLE_DISPLAY_VALUE = 'none'
  const NON_VIEWABLE_VISIBILITY_VALUE = 'hidden'
  const INVALID_SELECTOR_ERROR_MSG = 'An invalid selector was passed:'
  
  /**
   * A flag indicating whether the watcher should check for changes to the viewability of the specified HTML elements.
   */
  let checkForViewabilityChanges = true
  
  /**
   * The intervalID of the timer returned from setInterval in the `watch` function.
   * @type {Number}
   */
  let intervalId

  /**
   * A hash map of elements in which to track viewability, for which the key is the
   *  selector, while the value is an object with the following properties:
   *  - element: a reference to the HTMLElement object of the element to track
   *  - viewport: a reference to the HTMLElement object of the viewport
   *  - callback: a function to call after the element's viewability is checked
   *  - percentage: a numeric value from 1-100 indicating the minimum visible 
   *     area of the element to consider viewable.
   * @type {Object}
   */
  const elementsToTrack = {}
  
  /**
   * Utility function to check whether the window object exists. This is useful for 
   *   SSR apps.
   * @returns {Boolean}
   */
  const checkIfHasWindow = () => typeof window !== 'undefined'
  
  /**
   * Utility function to get an element by CSS selector.
   * @param {String or HTMLElement} Either a CSS Selector or a reference to an HTMLElement object.
   *   If the latter is passed, it is simply returned.
   * @returns {HTMLElement}
   */
  const selectElement = selector => {
    switch (typeof selector) {
      case 'string':
        return document.querySelector(selector)
        break;
      case 'object':
        return selector
      default:
        throw ERROR_MSG
        return null
    }
  }

  /**
   * Determines whether a certain percentage of a specified element is viewable with a given viewport.
   *   By default, it will check if the specified element is at least 50% viewable in `document.body`.
   * @param {Object} options A object with properties to initialize tracking of an element.
   * @param {String or Object} options.element A CSS selector selector, or a reference to an HTMLElement object.
   * @param {String or Object} options.viewport A CSS selector selector, or a reference to an HTMLElement object.
   * @param {Number} [options.percentage=50] The percentage of the selected element that must be visible
   *   in the given viewport to be considered viewable.
   * @param {Function} options.onViewable A callback to fired when the element is viewable. 
   * @param {Function} options.onNotViewable A callback to fired when the element is not viewable. 
   */
  const track = ({
    element: elementOrSelector,
    viewport: viewportOrSelector = document.body,
    onViewable,
    onNotViewable = _ => _,
    percentage = 50
  }) => {
    const element = selectElement(elementOrSelector)
    const viewport = selectElement(viewportOrSelector)

    if (element && viewport && typeof onViewable === 'function') {
      elementsToTrack[JSON.stringify(elementOrSelector)] = {
        element,
        viewport,
        percentage,
        onViewable,
        onNotViewable,
        isViewable: null
      }

      if (autoWatch && !intervalId) watch()
    }
  }

  /**
   * 
   */
  const check = () => { checkForViewabilityChanges = true }

  /**
   * Checks viewability for an array of elements on an interval
   */
  const watch = () => {
    const hasElementsToTrack = Object.entries(elementsToTrack).length > 0
    const allowWatcher = hasElementsToTrack || autoWatch
    
    if (!allowWatcher || !checkIfHasWindow()) {
      intervalId = null
      return
    }

    intervalId = setInterval(() => window.requestAnimationFrame(() => {
      if (!checkForViewabilityChanges) return

      checkForViewabilityChanges = false
      
      const selectors = Object.keys(elementsToTrack)
      
      if (selectors.length === 0) {
        stop()
        return
      }

      Object.keys(elementsToTrack).forEach(selector => {
        const {
          element,
          viewport,
          percentage,
          onViewable,
          onNotViewable,
          isViewable: wasViewable
        } = elementsToTrack[selector]
 
        const isViewable = checkViewability(element, viewport, percentage)

        if (isViewable === wasViewable) return

        elementsToTrack[selector].isViewable = isViewable
        
        isViewable
          ? typeof onViewable === 'function'  && onViewable(element)
          : typeof onNotViewable === 'function'  && onNotViewable(element)
      })
    }, interval))
  }

  /**
   * Stops the timer from running
   */
  const stop = () => {
    checkIfHasWindow() && clearInterval(intervalId)
    intervalId = null
  }

  const checkViewability = function(element, viewport, percentage) {
    const { max, min, round } = Math

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

    if (
      display === NON_VIEWABLE_DISPLAY_VALUE ||
      visibility === NON_VIEWABLE_VISIBILITY_VALUE ||
      opacity < MINIMUM_VIEWABLE_OPACITY ||
      elementArea < MINIMUM_VIEWABLE_AREA
    ) return false
    
    const {
      x: vpX,
      y: vpY,
      width: vpW,
      height: vpH,
    } = viewport.getBoundingClientRect()
    const vpT = max(vpX, 0)
    const vpL = max(vpY, 0)
    const vpR = min(vpL + vpW, window.innerWidth)
    const vpB = min(vpT + vpH, window.innerHeight)

    const viewableLength = min(elR, vpR) - max(elL, vpL)
    const viewableWidth = min(elB, vpB) - max(elT, vpT)
    const viewableArea = max(0, viewableLength * viewableWidth)
    const viewablePercentage = viewableArea / elementArea * 100
    const isViewable = viewablePercentage >= percentage

    return isViewable
  }
  
  return { check, stop, track, watch }
}
