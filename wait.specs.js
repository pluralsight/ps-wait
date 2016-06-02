const wait = require('.')

function resolveIn(millis, value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value)
    }, millis)
  })
}

describe('wait', () => {
  describe('#until', () => {
    it('returns a promise', () => {
      expect(wait.until(() => true)).to.be.an.instanceof(Promise)
    })

    context('when the condition is sync', () => {
      it('resolves when the condition becomes true', () => {
        let startTime = new Date().getTime()
        let itIsDone = false
        setTimeout(() => itIsDone = true, 100)
        return wait.until(() => itIsDone)
          .then(() => {
            const endTime = new Date().getTime()
            expect(endTime - startTime).to.be.at.least(100)
          })
      })

      it('rejects if the condition does not become true before the max wait time', () => {
        return expect(wait.until(() => false, 20, 100)).to.be.rejectedWith(
          'Error: Failed to meet the following condition after 100 ms: () => false')
      })
    })

    context('when the condition returns a promise', () => {
      it('resolves when the condition becomes true', () => {
        let startTime = new Date().getTime()
        let itIsDone = false
        setTimeout(() => itIsDone = true, 100)
        return wait.until(() => resolveIn(10, itIsDone))
          .then(() => {
            const endTime = new Date().getTime()
            expect(endTime - startTime).to.be.at.least(100)
          })
      })

      it('rejects if the condition does not become true before the max wait time', () => {
        return expect(wait.until(() => resolveIn(10, false), 20, 100)).to.be.rejectedWith(
          'Error: Failed to meet the following condition after 100 ms: () => resolveIn(10, false)')
      })
    })
  })
})