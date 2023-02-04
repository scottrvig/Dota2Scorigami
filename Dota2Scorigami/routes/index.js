'use strict';
var express = require('express');
var router = express.Router();
const { poolPromise } = require('../services/db');

var maxScore = 85;

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', { title: 'Dota 2 Scorigami', maxScore: maxScore });
});

router.get('/getScorigamiMatrix', async (req, res) => {
    // TODO: "Query parameters" for "include The International", Majors, etc
    var query = "SELECT match_id, start_time, dire_score, radiant_score, dire_team_name, radiant_team_name, league_name FROM dbo.Matches";

    var matrix = Array(maxScore).fill().map(() => Array(maxScore).fill(0));

    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);

        // Build scorigami matrix
        for (var i = 0; i < result.recordset.length; i++) {
            matrix[result.recordset[i].radiant_score][result.recordset[i].dire_score]++;
        }

        res.json(matrix);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

router.get('/getMatchesWithScore/:radiantScore/:direScore', async (req, res) => {
    var query = "SELECT match_id, start_time, dire_score, radiant_score, dire_team_name, radiant_team_name, league_name";
    query += " FROM dbo.Matches";
    query += " WHERE radiant_score = " + req.params.radiantScore;
    query += " AND dire_score = " + req.params.direScore;

    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

module.exports = router;
