/**
 * Created by bhacaz on 11/04/17.
 */

var uid = {};

uid = function(){
    var currentDate = new Date();
    return (currentDate.getTime()) + '' + Math.floor(Math.random() * 100);
};

module.exports = uid;