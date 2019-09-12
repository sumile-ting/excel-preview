// 'use strict'

var CUSTOM_UTIL = function(){

    var transformStr = function(input) {
        let inputArr = [...input];
        let sum = 0;
        for(let i = 0; i < inputArr.length; i++) {
            sum += Math.pow(26, i) * (inputArr[i].charCodeAt() - "A".charCodeAt());
        }
        return sum;
    };

    return {
        rgbaToRgb: function(rgba) {
            var reg = /^([0-9a-fA-f]{8})$/;
            if(!rgba || !reg.test(rgba)) {
                return 'rgba(255, 255, 255, 0)';
            }
            let a = parseInt(rgba.substring(0, 2), 16);
            let r = parseInt(rgba.substring(2, 4), 16);
            let g = parseInt(rgba.substring(4, 6), 16);
            let b = parseInt(rgba.substring(6, 8), 16);

            return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        },

        splitRC: function(rc) {
            let rcArr = [...rc];
            let index = 0;
            var i = 0;
            for(i = 0; i < rcArr.length; i++) {
                if (/^([1-9]*)$/.test(rcArr[i])) {
                    break;
                }
            }
            if(i < rcArr.length) {
                return {
                    c: Number(rc.substring(i)),
                    r: rc.substring(0, i)
                }
            }
            return {
                r: 0,
                c: rc.substring(0, i)
            }
        },

        /**
         *  BA - D
        */
        computeR: function(end, start) {
            return transformStr(end) - transformStr(start);
        }
    }
}();