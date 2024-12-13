/**
 * This function Calculates the remaining seconds to midnight 00:00
 */
export const secondsToMidnight = (n: any) => {
    return (
        ((24 - n.getHours() - 1) * 60 * 60) + ((60 - n.getMinutes() - 1) * 60) + (60 - n.getSeconds())
    )
}