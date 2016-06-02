## Usage

```javascript
const wait = require('ps-wait')

wait.until(() => conditionIsTrue())
    .then(() => doSomeOtherStuff())
```

## API

`wait.until(callback, intervalMs, maxWaitTimeMs)`

**callback**
Is called on an interval until the result is truthy.
If it returns a promise, then the value the promise is resolved with
will be checked instead.

**intervalMs**
How often to call the callback.

**maxWaitTimeMs**
If the callback does not return or resolve to a truthy value within this
time limit in milliseconds, then the Promise returned by wait.until will
reject.
