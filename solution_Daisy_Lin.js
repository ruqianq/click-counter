const fs = require('fs');
const _ = require('lodash');

function roundTimeStampToHour(timeStamp) {
    let dt = new Date(timeStamp);
    dt = new Date(dt.setMinutes(0));
    dt = new Date(dt.setSeconds(0));
    dt = new Date(dt.setMilliseconds(0));

    return dt.getTime();
}

function findExpansiveClick(clicks) {
    const sortedClicks = clicks.sort((x, y) => new Date(y.timestamp) - new Date(x.timestamp)).reverse();
    return sortedClicks.reduce((max, c) => {
        return (c.amount > max.amount) ? c : max
    }, clicks[0])
}

function groupByTimestamp(clicks) {
    return clicks.reduce((acc, cur) => {
        let ts = roundTimeStampToHour(cur.timestamp);
        if (!acc[ts]) {
            acc[ts] = []
        }
        acc[ts].push(cur);
        return acc
    }, {});
}

function groupByIp(clicks) {
    return _.groupBy(clicks,'ip')
}

function createIpTimestampLookup(clicksLookUp) {
    for (let key in clicksLookUp) {
        if (clicksLookUp.hasOwnProperty(key)) {
            clicksLookUp[key] = groupByTimestamp(clicksLookUp[key]);
            }
        }
    return clicksLookUp
}

function removeExcessiveClicks(clicksLookUp) {
    for (let key in clicksLookUp){
        if (clicksLookUp[key].length > 10 && clicksLookUp.hasOwnProperty(key)) {
            delete clicksLookUp[key]
        }
    }
    return clicksLookUp
}

function doStatistics( inputData, outputFile ) {
    const resultSet = returnMaxClicksByPeriod(data);
    fs.writeFileSync(outputFile, JSON.stringify(resultSet, null, 2));
}

module.exports.doStatistics = doStatistics;
module.exports.roundTimeStampToHour = roundTimeStampToHour;
module.exports.groupByIp = groupByIp;
module.exports.removeExcessiveClicks = removeExcessiveClicks;
module.exports.groupByTimestamp = groupByTimestamp;
module.exports.findExpansiveClick = findExpansiveClick;
module.exports.createIpTimestampLookup = createIpTimestampLookup