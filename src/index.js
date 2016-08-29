import {getDisplayName} from './getDisplayName'
import {normalizeOptions} from './normalizeOptions'
import {shouldInclude} from './shouldInclude'

function createComponentWillMount (opts) {
  return function componentWillMount (prevProps, prevState) {
    const displayName = getDisplayName(this)

    if (!shouldInclude(displayName, opts)) {
      return
    }

    opts.notifier({displayName, props: this.props, state: this.state})
  }
}

function createComponentWillUpdate (opts) {
  return function componentWillUpdate (prevProps, prevState) {
    const displayName = getDisplayName(this)

    if (!shouldInclude(displayName, opts)) {
      return
    }

    opts.notifier({displayName, props: this.props, state: this.state})
  }
}

export const logWhenYouUpdate = (React, opts = {}) => {
  const _componentWillMount = React.Component.prototype.componentWillMount
  const _componentWillUpdate = React.Component.prototype.componentWillUpdate
  const _createClass = React.createClass
  opts = normalizeOptions(opts)

  React.Component.prototype.componentWillMount = createComponentWillMount(opts)
  React.Component.prototype.componentWillUpdate = createComponentWillUpdate(opts)

  if (_createClass) {
    React.createClass = function createClass (obj) {
      if (!obj.mixins) {
        obj.mixins = []
      }

      const Mixin = {
        componentWillMount: createComponentWillMount(opts),
        componentWillUpdate: createComponentWillUpdate(opts)
      }

      obj.mixins = [Mixin].concat(obj.mixins)

      return _createClass.call(React, obj)
    }
  }

  React.__LOG_WHEN_YOU_UPDATE_RESTORE_FN__ = () => {
    React.Component.prototype.componentWillMount = _componentWillMount
    React.Component.prototype.componentWillUpdate = _componentWillUpdate
    React.createClass = _createClass
    delete React.__LOG_WHEN_YOU_UPDATE_RESTORE_FN__
  }

  return React
}

export default logWhenYouUpdate
