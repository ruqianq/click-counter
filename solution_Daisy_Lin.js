const fs = require('fs');
const _ = require('lodash');

function returnMaxClicksByPeriod (clicks) {
    // const maxClicks = findMaxClickPerPeriod(clicks, []);
    // const clicksLookUps = groupByIp(maxClicks);
    // return checkNumberOfClicks(clicksLookUps)
}

function roundTimeStampToHour(timeStamp) {
    let dt = new Date(timeStamp);
    dt = new Date(dt.setMinutes(0));
    dt = new Date(dt.setSeconds(0));
    dt = new Date(dt.setMilliseconds(0));

    return dt.getTime();
}

function findMaxClickPerPeriod(clicks, maxClicks = []) {
    const startPeriod = roundTimeStampToHour(clicks[0].timestamp);
    const clicksInPeriod = [];
    for (let i = 0; i < clicks.length; i++) {
        const clickTime = roundTimeStampToHour(clicks[i].timestamp);
        if (clickTime === startPeriod) {
            clicksInPeriod.push(clicks[i])
        } else {
            const maxClick = findMaxClick(clicksInPeriod);
            maxClicks.push(maxClick);
            return findMaxClickPerPeriod(clicks.slice(i), maxClicks)
        }
    }
    return maxClicks

    // const startPeriod = new Date(clicks[0].timestamp).getHours() + 1;
    // const clicksInPeriod = [];
    // for (let i = 0; i < clicks.length; i++) {
    //     const clickTime = new Date(clicks[i].timestamp);
    //     if (clickTime.getHours() < startPeriod && clickTime.getMinutes() <= 59 && clickTime.getSeconds() <= 59) {
    //         clicksInPeriod.push(clicks[i])
    //     } else {
    //         const maxClick = findMaxClick(clicksInPeriod);
    //         maxClicks.push(maxClick);
    //         return findMaxClickPerPeriod(clicks.slice(i), maxClicks)
    //     }
    // }
    // return maxClicks
}

function findMaxClick(clicksInPeriod) {
    return clicksInPeriod.reduce((max, c) => {
        return (c.amount > max.amount) ? c : max
    }, clicksInPeriod[0])
}

function groupByIp(clicks) {
    // lodash's _.groupBy can also achieve the same result
    return clicks.reduce((acc, obj) => {
        if (! acc[obj.ip]) {
            acc[obj.ip] = [];
        }
        acc[obj.ip].push(obj);

        return acc
    }, {})
}

function checkNumberOfClicks(clicksLookUp) {
    for (let key in clicksLookUp){
        if (clicksLookUp[key].length > 10 && clicksLookUp.hasOwnProperty(key)) {
            return {
                ...clicksLookUp,
                [`${key}`]: [clicksLookUp[key][0]]
            }}
        return {
            ...clicksLookUp
        }
    }
}

function doStatistics( inputData, outputFile ) {
    const resultSet = returnMaxClicksByPeriod(data);
    fs.writeFileSync(outputFile, JSON.stringify(resultSet, null, 2));
}

module.exports.doStatistics = doStatistics;
module.exports.returnMaxClicksByPeriod = returnMaxClicksByPeriod;
module.exports.roundTimeStampToHour = roundTimeStampToHour;