const { returnMaxClicksByPeriod, roundTimeStampToHour } = require('./solution_Daisy_Lin.js');

const data = [
    {"ip": "22.22.22.22", "timestamp": "3/11/2016 02:02:58", "amount": 7.00},
    {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:12:32", "amount": 6.50},
    {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:13:11", "amount": 7.25},
    {"ip": "44.44.44.44", "timestamp": "3/11/2016 02:13:54", "amount": 8.75},
    {"ip": "22.22.22.22", "timestamp": "3/11/2016 05:02:45", "amount": 11.00},
    {"ip": "44.44.44.44", "timestamp": "3/11/2016 06:32:42", "amount": 5.00},
    {"ip": "44.44.44.44", "timestamp": "3/11/2016 06:32:42", "amount": 5.00},
    {"ip": "44.44.44.44", "timestamp": "3/11/2016 06:32:42", "amount": 5.00},
    {"ip": "44.44.44.44", "timestamp": "3/11/2016 06:32:42", "amount": 5.00},
    {"ip": "44.44.44.44", "timestamp": "3/11/2016 06:32:42", "amount": 5.00},
    {"ip": "44.44.44.44", "timestamp": "3/11/2016 06:32:42", "amount": 5.00},
    {"ip": "44.44.44.44", "timestamp": "3/11/2016 06:32:42", "amount": 5.00},
    {"ip": "44.44.44.44", "timestamp": "3/11/2016 06:32:42", "amount": 5.00},
    {"ip": "44.44.44.44", "timestamp": "3/11/2016 06:32:42", "amount": 5.00},
    {"ip": "44.44.44.44", "timestamp": "3/11/2016 06:32:42", "amount": 5.00},
    {"ip": "44.44.44.44", "timestamp": "3/11/2016 06:32:42", "amount": 5.00},
    {"ip": "22.22.22.22", "timestamp": "3/11/2016 06:35:12", "amount": 2.00},
    {"ip": "22.22.22.22", "timestamp": "3/12/2016 06:35:12", "amount": 2.00},
];

const expectedResultIncorrect = {
    "44.44.44.44": [
        {"ip": "44.44.44.44", "timestamp": "3/11/2016 02:13:54", "amount": 8.75}
    ],
    "22.22.22.22": [
        {"ip": "22.22.22.22", "timestamp": "3/11/2016 05:02:45", "amount": 11.00}
    ]
};

const expectedResult = [
    {"ip": "11.11.11.11", "timestamp": "3/11/2016 02:13:11", "amount": 7.25},
    {"ip": "22.22.22.22", "timestamp": "3/11/2016 06:35:12", "amount": 2.00},
    {"ip": "22.22.22.22", "timestamp": "3/12/2016 06:35:12", "amount": 2.00},
];

// test('test find', () => {
//     const result = returnMaxClicksByPeriod(data);
//     console.log(result);
//     expect(result).toEqual(expectedResult);
// });
//

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
});
