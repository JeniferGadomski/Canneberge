var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    console.log('home page');
    if(req.query.hasOwnProperty('fermeId')){
        res.render('../public/index');
    }
    else{
        res.redirect('http://admin.canneberge.io/fermes');
    }
});

// router.get('/:fermeID', function(req, res) {
//     console.log(req.params.fermeID);
//     res.render('../public/index');
// });

module.exports = router;