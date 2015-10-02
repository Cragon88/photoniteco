/**
 * Created by thanhnguyen on 02/10/2015.
 */

var gm = require('gm');
var fs = require('fs-extra');

exports.resize = function(fullPath) {
    var maxDimension = 250;
    var newName = '/ui/imgs/2015/MalaysiaCompanyTrip/hrhr.JPG';
    gm(fullPath)
        .size(function(err, value){
            var newWidth = value.width, newHeight = value.height, ratio = 1;
            if (value.width > maxDimension || value.height > maxDimension){
                if (value.width > maxDimension){
                    ratio = maxDimension / value.width;
                }
                else if (value.height > maxDimension){
                    ratio = maxDimension / value.height;
                }
                newWidth = value.width * ratio;
                newHeight = value.height * ratio;
            }

            if (newWidth != value.width){
                gm(fullPath).resize(newWidth, newHeight).write(newName, function(err){
                    if (err) console.log("Error: " + err);
                });
            }else {
                fs.copy(fullPath, newName, function (err) {
                    if (err) return console.error(err)
                    console.log("success!")
                }) // copies file
            }
        });
}