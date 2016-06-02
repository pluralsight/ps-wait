"use strict"

const isPromise = require('is-promise')

class Wait {

  until(conditionalFunction, retryIntervalMs = 50, maxMsToWait = 6500) {
    const maxTime = new Date().getTime() + maxMsToWait

    let errorInConditionalFunction = null
    let wasConditionMet = false
    let isWaiting = true

    function hasExceededMaxWaitTime() {
      return new Date().getTime() > maxTime
    }

    function handleResponse(response) {
      if (response) {
        wasConditionMet = true
        isWaiting = false
      } else if (hasExceededMaxWaitTime())
        isWaiting = false
      else
        setTimeout(checkCondition, retryIntervalMs)
    }

    function handleError(err) {
      errorInConditionalFunction = err
      isWaiting = false
    }

    function checkCondition() {
      try {
        let response = conditionalFunction()

        if (isPromise(response))
          response.then(handleResponse).catch(handleError)
        else
          handleResponse(response)

      } catch (e) {
        handleError(e)
      }
    }

    checkCondition()

    return new Promise((resolve, reject) => {
      const conditionCheckInterval = setInterval(() => {
        if (isWaiting && !hasExceededMaxWaitTime()) return;

        clearInterval(conditionCheckInterval)

        if (wasConditionMet) resolve(true)
        else if (errorInConditionalFunction) reject(errorInConditionalFunction)
        else reject(new Error(`Failed to meet the following condition after ${maxMsToWait} ms: ${conditionalFunction.toString()}`))
      }, 1)
    })
  }
}

module.exports = new Wait()