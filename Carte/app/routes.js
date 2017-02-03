var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.redirect('http://localhost:4200/fermes');
});

router.get('/:fermeID', function(req, res) {
    res.render('../public/index', {fermeID : req.params.fermeID});
});

module.exports = router;