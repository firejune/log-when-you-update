import {deepEqual, equal, ok} from 'assert'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import logWhenYouUpdate from 'src/'

const noop = () => {}

const createConsoleStore = type => {
  const entries = []
  const fn = global.console[type]

  global.console[type] = (...args) => {
    entries.push(args)
    // uncomment to debug tests
    // fn.call(global.console, ...args)
  }

  return {
    destroy: () => global.console[type] = fn,
    entries
  }
}

class Stub extends React.Component {
  render () {
    return <noscript />
  }
}

describe(`logWhenYouUpdate`, () => {
  let node
  let logStore

  beforeEach(() => {
    logWhenYouUpdate(React)
    node = document.createElement(`div`)
    logStore = createConsoleStore(`log`)
  })

  afterEach(() => {
    React.__LOG_WHEN_YOU_UPDATE_RESTORE_FN__()
    unmountComponentAtNode(node)
    logStore.destroy()
  })

  it(`logs an receive correct props`, () => {
    render(<Stub a={1} />, node)

    const displayName = logStore.entries[0][0]
    const props = logStore.entries[0][2].props

    equal(displayName, `%cStub`)
    deepEqual(props, {a: 1})
  })

  it(`can ignore certain names using a regexp`, () => {
    React.__LOG_WHEN_YOU_UPDATE_RESTORE_FN__()
    logWhenYouUpdate(React, {exclude: /Stub/})

    render(<Stub a={1} />, node)
    render(<Stub a={1} />, node)

    equal(logStore.entries.length, 0)
  })

  it(`can ignore certain names using a string`, () => {
    React.__LOG_WHEN_YOU_UPDATE_RESTORE_FN__()
    logWhenYouUpdate(React, {exclude: `Stub`})

    render(<Stub a={1} />, node)
    render(<Stub a={1} />, node)

    equal(logStore.entries.length, 0)
  })

  it(`can include only certain names using a regexp`, () => {
    React.__LOG_WHEN_YOU_UPDATE_RESTORE_FN__()
    logWhenYouUpdate(React, {include: /Foo/})

    class Foo extends React.Component {
      render () {
        return <noscript />
      }
    }

    const createInstance = () =>
      <div>
        <Stub a={1} />
        <Foo a={1} />
      </div>

    render(createInstance(), node)
    render(createInstance(), node)

    equal(logStore.entries.length, 2)
    equal(logStore.entries[0][0], `%cFoo`)
    equal(logStore.entries[1][0], `%cFoo`)
  })

  it(`can include only certain names using a string`, () => {
    React.__LOG_WHEN_YOU_UPDATE_RESTORE_FN__()
    logWhenYouUpdate(React, {include: `Foo`})

    class Foo extends React.Component {
      render () {
        return <noscript />
      }
    }

    class FooBar extends React.Component {
      render () {
        return <noscript />
      }
    }

    const createInstance = () =>
      <div>
        <Stub a={1} />
        <Foo a={1} />
        <FooBar a={1} />
      </div>

    render(createInstance(), node)
    render(createInstance(), node)

    equal(logStore.entries.length, 2)
    equal(logStore.entries[0][0], `%cFoo`)
    equal(logStore.entries[1][0], `%cFoo`)
  })

  it(`can both include an exclude option`, () => {
    React.__LOG_WHEN_YOU_UPDATE_RESTORE_FN__()
    logWhenYouUpdate(React, {include: /Stub/, exclude: /Foo/})

    class StubFoo extends React.Component {
      render () {
        return <noscript />
      }
    }

    class StubBar extends React.Component {
      render () {
        return <noscript />
      }
    }

    const createInstance = () =>
      <div>
        <Stub a={1} />
        <StubFoo a={1} />
        <StubBar a={1} />
      </div>

    render(createInstance(), node)
    render(createInstance(), node)

    equal(logStore.entries.length, 4)
    equal(logStore.entries[0][0], `%cStub`)
    equal(logStore.entries[1][0], `%cStubBar`)
    equal(logStore.entries[2][0], `%cStub`)
    equal(logStore.entries[3][0], `%cStubBar`)
  })

  it(`accepts arrasy as args to include/exclude`, () => {
    React.__LOG_WHEN_YOU_UPDATE_RESTORE_FN__()
    logWhenYouUpdate(React, {include: [/Stub/], exclude: [/Foo/, `StubBar`]})

    class StubFoo extends React.Component {
      render () {
        return <noscript />
      }
    }

    class StubBar extends React.Component {
      render () {
        return <noscript />
      }
    }

    const createInstance = () =>
      <div>
        <Stub a={1} />
        <StubFoo a={1} />
        <StubBar a={1} />
      </div>

    render(createInstance(), node)
    render(createInstance(), node)

    equal(logStore.entries.length, 2)
    equal(logStore.entries[0][0], `%cStub`)
    equal(logStore.entries[1][0], `%cStub`)
  })

  it(`works with createClass`, () => {
    const Foo = React.createClass({
      displayName: `Foo`,

      render () {
        return <noscript />
      }
    })

    render(<Foo a={1} />, node)
    render(<Foo a={1} />, node)

    equal(logStore.entries.length, 2)
    equal(logStore.entries[0][0], `%cFoo`)
    equal(logStore.entries[1][0], `%cFoo`)
  })

  it(`still calls the original componentDidUpdate for createClass`, done => {
    const Foo = React.createClass({
      displayName: `Foo`,

      componentDidUpdate () {
        done()
      },

      render () {
        return <noscript />
      }
    })

    render(<Foo a={1} />, node)
    render(<Foo a={1} />, node)

    equal(logStore.entries.length, 2)
  })
})
