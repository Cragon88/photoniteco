/**
 * Created by thanhnguyen on 08/10/2015.
 */

var mongoose = require('mongoose');

var MenusBo = {};


MenusBo.insert = function(date, albumName) {
    var Menus = mongoose.model('Menus');
    Menus.findOne({year: date.getYear(), month:date.getMonth()}).
        exec(function(err, menu) {
            if(err) {
                console.log(err);
            } else {
                 var m;
                 if(menu) {
                     menu.albumNames.push(albumName);
                     m = menu;
                 } else {
                     var names = [albumName];
                     m = new Menus({year:date.getYear(), month:date.getMonth(), albumNames: names});
                 }
                m.save(function(err, result){
                    if(err) {
                        console.log(err);
                    }
                });
            }
    });
}

module.exports = MenusBo;