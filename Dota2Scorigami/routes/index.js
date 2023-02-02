'use strict';
var express = require('express');
var db = require('../services/db');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

router.get('/getScorigamiMatrix', (req, res) => {
    // TODO: "Query parameters" for "include The International", Majors, etc

    // TODO: Fix async
    var matrix = db.getScorigamiMatrix();
    res.send(matrix);
});

router.get('/getMatchesWithScore/:radiantScore/:direScore', (req, res) => {
    var result = db.getMatchesWithScore(radiantScore, direScore);
    res.send(result);
});

module.exports = router;
