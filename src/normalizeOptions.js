import {defaultNotifier} from './defaultNotifier'

export const DEFAULT_INCLUDE = /./
export const DEFAULT_EXCLUDE = /[^a-zA-Z0-9]/

const toRegExp = s => typeof(s) === 'string' ? new RegExp(`^${s}$`) : s
const toArray = o =>  o ? [].concat(o) : []

export const normalizeOptions = (opts = {}) => {
  let {
    include = [DEFAULT_INCLUDE],
    exclude = [DEFAULT_EXCLUDE],
    notifier = defaultNotifier
  } = opts


  return {
    notifier,
    include: toArray(include).map(toRegExp),
    exclude: toArray(exclude).map(toRegExp)
  }
}
