
export function convertTimeValue(time) {
    return time < 10 ? '0' + time.slice(-2) : time
}


