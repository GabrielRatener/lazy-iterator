var co = require('co');
var LazyIterator = require("./lazy-iterator");    // node only


var li = new LazyIterator();
var INTERVAL = 1000, i = 0;

var interval = setInterval(function(){
	if (li.closed){
		clearInterval(interval);
		return;
	} else {
	    li.send(i);
	    i += INTERVAL;
	}
}, INTERVAL);

co(function*(){
    while (true) {
        var out = yield li.next();
        if (out.done) break;
        else var timePassed = out.value;

        console.log(timePassed);
        if (timePassed === 10000){
        	li.close();
        }
    }
});
