/*

  covert seconds to { days, hours, minutes }

*/
export const fromSeconds = (_seconds: number) => {
  let minutes = _seconds / 60
  let hours = minutes / 60
  let days = hours / 24
  let seconds = 0

  if (days >= 1) {
    const daysMod = days % 1
    days = days - daysMod

    if (daysMod > 0) {
      hours = daysMod * 24
      const hoursMod = hours % 1
      if (hoursMod > 0) {
        hours = hours - hoursMod
        minutes = Math.round(hoursMod * 60)
      } else if (hoursMod === 0) {
        return { days, hours, minutes: 0 }
      }
    } else if (daysMod === 0) {
      return { days, hours: 0, minutes: 0 }
    }
  } else if (hours >= 1) {
    const hoursMod = hours % 1
    if (hoursMod > 0) {
      days = 0
      hours = hours - hoursMod
      minutes = Math.round(hoursMod * 60)
    } else if (hoursMod === 0) {
      return { days: 0, hours, minutes: 0 }
    }
  } else {
    const minutesMod = minutes % 1
    seconds = Math.round(minutesMod * 60)
    minutes = minutes - minutesMod

    hours = hours >= 1 ? hours : 0
    days = days >= 1 ? days : 0
  }

  return { days, hours, minutes, seconds }
}
