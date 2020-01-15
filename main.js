const data = require('./clicks.json');
const { doStatistics } = require('./solution_Daisy_Lin')

doStatistics(data, './resultSet.json');