const data = require('./clicks.json');
const { saveToFile } = require('./solution_Daisy_Lin');

saveToFile(data, './resultset.json');