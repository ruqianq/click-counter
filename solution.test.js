const { roundTimeStampToHour, groupByIp, removeExcessiveClicks,
    groupByTimestamp, findExpansiveClickPerTime, createIpTimestampLookup } = require('./solution_Daisy_Lin.js');

const testData = [
    {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00},
    {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:12:32", "amount": 6.50},
    {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:13:11", "amount": 7.25},
    {"ip": "44.44.44.44", "timestamp": "3/11/2016 02:13:54", "amount": 8.75},
    {"ip": "22.22.22.22", "timestamp": "3/11/2016 05:02:45", "amount": 11.00},
    {"ip": "22.22.22.22", "timestamp": "3/12/2016 06:35:12", "amount": 2.00},
];
const expectedResultIncorrect = {
    "44.44.44.44": {
        1457679600000: [
            {"ip": "44.44.44.44", "timestamp": "3/11/2016 02:13:54", "amount": 8.75}
        ]},
    "22.22.22.22": {
        1457690400000: [
            {"ip": "22.22.22.22", "timestamp": "3/11/2016 05:02:45", "amount": 11.00}
            ]}
};

describe('roundTimeStampToHour', () => {
    test('same hour but different minutes should be normalized to the same hour', () => {
        const t1 = roundTimeStampToHour("3/11/2016 06:32:42");
        const t2 = roundTimeStampToHour("3/11/2016 06:59:59");
        expect(t1 === t2).toBeTruthy();
    });

    test('timestamp with different hour should be unequal', () => {
        const t1 = roundTimeStampToHour("3/11/2016 06:32:42");
        const t2 = roundTimeStampToHour("3/11/2016 07:32:42");
        expect(t1 !== t2).toBeTruthy();
    });

    test('timestamp with same hour but different day should be unequal', () => {
        const t1 = roundTimeStampToHour("3/11/2016 06:32:42");
        const t2 = roundTimeStampToHour("3/12/2016 06:32:42");
        expect(t1 !== t2).toBeTruthy();
    });
    test('group the array by ip', () => {
        const ipLookups = groupByIp(testData);
        const expectedResult = {
            "22.22.22.22": [
                {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00},
                {"ip": "22.22.22.22", "timestamp": "3/11/2016 05:02:45", "amount": 11.00},
                {"ip": "22.22.22.22", "timestamp": "3/12/2016 06:35:12", "amount": 2.00}
            ],
            "11.11.11.11": [
                {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:12:32", "amount": 6.50},
                {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:13:11", "amount": 7.25},
            ],
            "44.44.44.44": [
                {"ip": "44.44.44.44", "timestamp": "3/11/2016 02:13:54", "amount": 8.75},
            ]};
            expect(ipLookups).toEqual(expectedResult)
    });
    test('remove the ip has more than 10 clicks', () => {
        const lookups = {
            "22.22.22.22": [
                {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00},
                {"ip": "22.22.22.22", "timestamp": "3/11/2016 05:02:45", "amount": 11.00},
                {"ip": "22.22.22.22", "timestamp": "3/12/2016 06:35:12", "amount": 2.00},
                {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00},
                {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00},
                {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00},
                {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00},
                {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00},
                {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00},
                {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00},
                {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00}
            ],
            "11.11.11.11": [
                {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:12:32", "amount": 6.50},
                {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:13:11", "amount": 7.25},
            ],
            "44.44.44.44": [
                {"ip": "44.44.44.44", "timestamp": "3/11/2016 02:13:54", "amount": 8.75},
            ]};
        const lookUpCln = removeExcessiveClicks(lookups);
        const expectedResult = {
            "11.11.11.11": [
                {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:12:32", "amount": 6.50},
                {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:13:11", "amount": 7.25},
            ],
            "44.44.44.44": [
                {"ip": "44.44.44.44", "timestamp": "3/11/2016 02:13:54", "amount": 8.75},
            ]};
            expect(lookUpCln).toEqual(expectedResult)
    });
    test('group the array by round up timestamp', () => {
        const testData = [
            {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00},
            {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:13:11", "amount": 7.25},
            {"ip": "22.22.22.22", "timestamp": "3/11/2016 05:02:45", "amount": 11.00},
            {"ip": "22.22.22.22", "timestamp": "3/12/2016 06:35:12", "amount": 2.00}];
        const expectedResult = {
            '1457679600000': [
                {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00},
                {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:13:11", "amount": 7.25}
            ],
            '1457690400000': [
                {"ip": "22.22.22.22", "timestamp": "3/11/2016 05:02:45", "amount": 11.00}
            ],
            '1457780400000': [
                {"ip": "22.22.22.22", "timestamp": "3/12/2016 06:35:12", "amount": 2.00}
            ]
        };
        expect(groupByTimestamp(testData)).toEqual(expectedResult);
    });
    test('find the most expansive click', () => {
        const testData = [
            {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00},
            {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:13:11", "amount": 7.25}
        ];
        expect(findExpansiveClickPerTime(testData)).toEqual({"ip": "11.11.11.11", "timestamp": "3/11/2016 02:13:11", "amount": 7.25})
    });
    test('return the earliest one to result when there is a tie', () => {
        const testData = [
            {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00},
            {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:45:11", "amount": 7.25},
            {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:13:11", "amount": 7.25}
            ];
        expect(findExpansiveClickPerTime(testData)).toEqual({"ip": "11.11.11.11", "timestamp": "3/11/2016 02:13:11", "amount": 7.25})
    });
    test('return the lookup table of the clicks', () => {
        const testData = [
            {"ip": "44.44.44.44", "timestamp": "3/11/2016 02:13:54", "amount": 8.75},
            {"ip": "22.22.22.22", "timestamp": "3/11/2016 05:02:45", "amount": 11.00},
        ];
        const expectedResult = {
            "44.44.44.44": {
                1457679600000: [
                    {"ip": "44.44.44.44", "timestamp": "3/11/2016 02:13:54", "amount": 8.75}
                ]},
            "22.22.22.22": {
                1457690400000: [
                    {"ip": "22.22.22.22", "timestamp": "3/11/2016 05:02:45", "amount": 11.00}
                ]}
        };
        const ipLookips = groupByIp(testData);
        const resultDate = createIpTimestampLookup(ipLookips);
        expect(resultDate).toEqual(expectedResult)
    })
});
