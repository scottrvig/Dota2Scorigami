var sql = require('mssql');
var config = require('../config.js')

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => console.log('Database connection failed. Bad config: ', err))

module.exports = {
    sql, poolPromise
}