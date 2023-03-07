export const hhmmss = (secs: string) => {
    let sec_num = parseInt(secs, 10) // don't forget the second param
    let hours = Math.floor(sec_num / 3600)
    let minutes = Math.floor((sec_num - hours * 3600) / 60) || ""
    let seconds = sec_num - hours * 3600 - Number(minutes) * 60 || ""
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    return minutes + ":" + seconds
}