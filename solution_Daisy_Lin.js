const fs = require('fs');
const _ = require('lodash');

function roundTimeStampToHour(timeStamp) {
    let dt = new Date(timeStamp);
    dt = new Date(dt.setMinutes(0));
    dt = new Date(dt.setSeconds(0));
    dt = new Date(dt.setMilliseconds(0));

    return dt.getTime();
}

function findExpansiveClickPerTime(clicks) {
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

function findExpansiveClickPerTimeIpLookup(clicksLookUp) {
    for (let key in clicksLookUp) {
        if (clicksLookUp.hasOwnProperty(key)) {
            let timeStampLookUp = groupByTimestamp(clicksLookUp[key]);
            let expansiveClicksPerTime = [];
            for (let t in timeStampLookUp) {
                expansiveClicksPerTime.push(findExpansiveClickPerTime(timeStampLookUp[t]))
            }
            console.log(expansiveClicksPerTime);
            clicksLookUp[key] = expansiveClicksPerTime;
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

function aggreateClick( clicks ) {
    const ipLookUp = groupByIp(clicks);
    const ipLookUpCln = removeExcessiveClicks(ipLookUp);
    const expansiveClickIpLookUp = findExpansiveClickPerTimeIpLookup(ipLookUpCln);
    return Object.values(expansiveClickIpLookUp).flat();
}
function saveToFile( inputData, outputFile ) {
    fs.writeFileSync(outputFile, JSON.stringify(resultSet, null, 2));
}

module.exports.doStatistics = aggreateClick;
module.exports.roundTimeStampToHour = roundTimeStampToHour;
module.exports.groupByIp = groupByIp;
module.exports.removeExcessiveClicks = removeExcessiveClicks;
module.exports.groupByTimestamp = groupByTimestamp;
module.exports.findExpansiveClickPerTime = findExpansiveClickPerTime;
module.exports.findExpansiveClickPerTimeIpLookup = findExpansiveClickPerTimeIpLookup;