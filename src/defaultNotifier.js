export const defaultNotifier = ({displayName, props, state}) => {
  console.log(`%c${displayName}`, 'color:gray', {props, state})
}
