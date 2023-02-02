'use strict';
var express = require('express');
var db = require('../services/db');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

router.get('/getScorigamiMatrix', asyncHandler(async (req, res) => {
    // TODO: "Query parameters" for "include The International", Majors, etc

    var matrix = await db.getScorigamiMatrix();
    res.send(matrix);
}));

router.get('/getMatchesWithScore/:radiantScore/:direScore', async (req, res) => {
    var result = await db.getMatchesWithScore(radiantScore, direScore);
    res.send(result);
});

module.exports = router;
