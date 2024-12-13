"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secondsToMidnight = void 0;
/**
 * This function Calculates the remaining seconds to midnight 00:00
 */
const secondsToMidnight = (n) => {
    return (((24 - n.getHours() - 1) * 60 * 60) + ((60 - n.getMinutes() - 1) * 60) + (60 - n.getSeconds()));
};
exports.secondsToMidnight = secondsToMidnight;
