const fs = require('fs');

function roundTimeStampToHour( timeStamp ) {
    let dt = new Date(timeStamp);
    dt = new Date(dt.setMinutes(0));
    dt = new Date(dt.setSeconds(0));
    dt = new Date(dt.setMilliseconds(0));

    return dt.getTime();
}

// lodash's _.groupBy can also achieve the same result
function groupByTimestamp( clicks ) {
    return clicks.reduce((acc, cur) => {
        let ts = roundTimeStampToHour(cur.timestamp);
        if (!acc[ts]) {
            acc[ts] = []
        }
        acc[ts].push(cur);
        return acc
    }, {});
}

function groupByIp( clicks ) {
    return clicks.reduce((acc, cur) => {
        let ip = cur.ip;
        if (!acc[ip]) {
            acc[ip] = []
        }
        acc[ip].push(cur);
        return acc
    }, {});
}

function findExpansiveClickPerTime( clicks ) {
    const sortedClicks = clicks.sort((x, y) => new Date(y.timestamp) - new Date(x.timestamp)).reverse();
    return sortedClicks.reduce((max, c) => {
        return (c.amount > max.amount) ? c : max
    }, clicks[0])
}

function findExpansiveClickPerTimeIpLookup( clicksLookUp ) {
    for (let key in clicksLookUp) {
        if (clicksLookUp.hasOwnProperty(key)) {
            let timeStampLookUp = groupByTimestamp(clicksLookUp[key]);
            let expansiveClicksPerTime = [];
            for (let t in timeStampLookUp) {
                expansiveClicksPerTime.push(findExpansiveClickPerTime(timeStampLookUp[t]))
            }
            clicksLookUp[key] = expansiveClicksPerTime;
            }
        }
    return clicksLookUp
}

function removeExcessiveClicks( clicksLookUp ) {
    for (let key in clicksLookUp){
        if (clicksLookUp[key].length > 10 && clicksLookUp.hasOwnProperty(key)) {
            delete clicksLookUp[key]
        }
    }
    return clicksLookUp
}

function aggregateClicks( clicks ) {
    const ipLookUp = groupByIp(clicks);
    const ipLookUpCln = removeExcessiveClicks(ipLookUp);
    const expansiveClickIpLookUp = findExpansiveClickPerTimeIpLookup(ipLookUpCln);
    const expansiveClicksFlat = [];
    Object.keys(expansiveClickIpLookUp).map(k => {
        if (Array.isArray(expansiveClickIpLookUp[k])) {
            for (i = 0; i < expansiveClickIpLookUp[k].length; i++) {
                expansiveClicksFlat.push(expansiveClickIpLookUp[k][i])
            }
        } return expansiveClickIpLookUp[k]
    });
    return expansiveClicksFlat
}
function saveToFile( inputData, outputFile ) {
    const resultSet = aggregateClicks(inputData);
    fs.writeFileSync(outputFile, JSON.stringify(resultSet, null, 2));
}

module.exports.aggregateClicks = aggregateClicks;
module.exports.roundTimeStampToHour = roundTimeStampToHour;
module.exports.groupByIp = groupByIp;
module.exports.removeExcessiveClicks = removeExcessiveClicks;
module.exports.groupByTimestamp = groupByTimestamp;
module.exports.findExpansiveClickPerTime = findExpansiveClickPerTime;
module.exports.findExpansiveClickPerTimeIpLookup = findExpansiveClickPerTimeIpLookup;
module.exports.saveToFile= saveToFile;