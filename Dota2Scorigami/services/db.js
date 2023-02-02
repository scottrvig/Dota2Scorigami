var sql = require('mssql');
var config = require('../config.js')
var maxScore = 85;

module.exports = {
    getScorigamiMatrix: function () {
        var matrix = Array(maxScore).fill().map(() => Array(maxScore).fill(0));

        sql.connect(config, function (err) {
            if (err) console.log(err);

            var req = new sql.Request();

            var query = "SELECT match_id, start_time, dire_score, radiant_score, dire_team_name, radiant_team_name, league_name";
            query += " FROM dbo.Matches";

            req.query(query, function (err, recordset) {
                if (err) console.log(err);

                for (var i = 0; i < recordset.recordsets[0].length; i++) {
                    var radiantScore = recordset.recordsets[0][i].radiant_score;
                    var direScore = recordset.recordsets[0][i].dire_score;
                    matrix[radiantScore][direScore]++;
                }

                return matrix;
            });
        });
    },

    getMatchesWithScore: function (radiantScore, direScore) {
        sql.connect(config, function (err) {
            if (err) console.log(err);

            var req = new sql.Request();

            var query = "SELECT match_id, start_time, dire_score, radiant_score, dire_team_name, radiant_team_name, league_name";
            query += " FROM dbo.Matches";
            query += " WHERE radiant_score = " + radiantScore;
            query += " AND dire_score = " + direScore;

            req.query(query, function (err, recordset) {
                if (err) console.log(err);

                return recordset;
            });
        });
    }
}