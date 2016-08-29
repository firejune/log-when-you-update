export const shouldInclude = (displayName, {include, exclude}) => {
  let isIncluded = false
  let isExcluded = false

  for (let i = 0; i < include.length; i++) {
    if (isIncluded = include[i].test(displayName)) {
      break
    }
  }

  for (let i = 0; i < exclude.length; i++) {
    if (isExcluded = exclude[i].test(displayName)) {
      break
    }
  }

  return isIncluded && !isExcluded
}
