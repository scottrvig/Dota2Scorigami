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
    var query = buildMatchQuery(req);

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

function buildMatchQuery(req) {
    var includeInternationals = ((req.query.includeInternationals + '').toLowerCase() === 'true');
    var includeMajors = ((req.query.includeMajors + '').toLowerCase() === 'true');
    var includeDpc = ((req.query.includeDpc + '').toLowerCase() === 'true');

    var query = "SELECT match_id, start_time, dire_score, radiant_score, dire_team_name, radiant_team_name, league_name FROM dbo.Matches";

    if (includeInternationals && includeMajors && includeDpc) {
        // All matches
        return query;
    }

    var whereAdded = false;

    if (!includeInternationals) {
        if (!whereAdded) {
            query += " WHERE league_name NOT LIKE '%international%'";
            whereAdded = true;
        } else {
            query += " AND league_name NOT LIKE '%international%'";
        }
    }

    if (!includeMajors) {
        if (!whereAdded) {
            query += " WHERE (league_name NOT LIKE '%major%' AND league_name NOT LIKE '%asia championship%')";
            whereAdded = true;
        } else {
            query += " AND (league_name NOT LIKE '%major%' AND league_name NOT LIKE '%asia championship%')";
        }
    }

    if (!includeDpc) {
        if (!whereAdded) {
            query += " WHERE league_name NOT LIKE '%dpc%'";
            whereAdded = true;
        } else {
            query += " AND league_name NOT LIKE '%dpc%'";
        }
    }

    return query;
}

module.exports = router;
