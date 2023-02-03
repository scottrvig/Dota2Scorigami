'use strict';
var express = require('express');
var router = express.Router();
const { poolPromise } = require('../services/db');

var maxScore = 85;

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

router.get('/getScorigamiMatrix', async (req, res) => {
    // TODO: "Query parameters" for "include The International", Majors, etc
    var query = "SELECT match_id, start_time, dire_score, radiant_score, dire_team_name, radiant_team_name, league_name FROM dbo.Matches";

    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        res.json(result.recordset);
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
