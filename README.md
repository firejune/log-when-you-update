# Log when you update, bruh?

[![Travis][build-badge]][build]
[![npm version](https://badge.fury.io/js/log-when-you-update.svg)](https://badge.fury.io/js/log-when-you-update)

### Wat?

A function that monkey patches React and notifies you in the console when component **renders** occur. Super helpful for easy perf gainzzzzz.

### How to

```js
import React from 'react'

if (process.env.NODE_ENV !== 'production') {
  const {logWhenYouUpdate} = require('log-when-you-update')
  logWhenYouUpdate(React)
}
```

You can include or exclude components by their displayName with the include and exclude options

```js
logWhenYouUpdate(React, { include: /^pure/, exclude: /^Connect/ })
```

### Credit

I originally read about how Benchling created a mixin to do this on a per component basis ([A deep dive into React perf debugging](http://benchling.engineering/deep-dive-react-perf-debugging/)).
That is really awesome but also tedious AF, so why not just monkey patch React.

[build-badge]: https://img.shields.io/travis/firejune/log-when-you-update/master.svg?style=flat-square
[build]: https://travis-ci.org/firejune/log-when-you-update
