var co = require('co');
var LazyIterator = require("./lazy-iterator");    // node only


var li = new LazyIterator();
var INTERVAL = 1000, i = 0;

setInterval(function(){
    li.add(i);
    i += INTERVAL;
}, INTERVAL);

co(function*(){
    while (true) {
        var out = yield li.next();
        if (out.done) break;
        else var timePassed = out.value;

        console.log(timePassed);
    }
});
