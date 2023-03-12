/*

  covert time { days, hours, minutes, seconds } to seconds

*/
interface toSeconds {
  days?: number | string
  hours?: number | string
  minutes?: number | string
  seconds?: number | string
}

export const toSeconds = ({ days, hours, minutes, seconds }: toSeconds) => {
  let secs = 0

  if (!!days) {
    secs = secs + Number(days) * 24 * 60 * 60
  }

  if (!!hours) {
    secs = secs + Number(hours) * 60 * 60
  }

  if (!!minutes) {
    secs = secs + Number(minutes) * 60
  }

  if (!!seconds) {
    secs = secs + Number(seconds)
  }

  return secs
}
