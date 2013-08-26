
var express = require('express');

var app = express();
app.use(express.static('app'));
app.use(express.static('lib'));
app.use(express.logger()); // move this first, if you want to log static urls
app.use(express.bodyParser());

// the data structure is a collection of bars
// each bar is a named list of (id, value) pairs
// the name must match [A-Za-z]+
// id: the pair's index in the list 0, 1, ..., length - 1
// value: an integer set by the client
var Bars = {
    bars: {},

    get: function (name) {
	if (name in this.bars) {
	    return this.bars[name];
	}
	var b = [];
	for (var i = 0; i < 100; i++) {
	    b.push({id: i, value: Math.round(Math.random() * 100)});
	}
	this.bars[name] = b;
	return b;
    },

    ensureLength: function(col, len) {
	if (len > col.length) {
	    for (var i = col.length; i < len; i++) {
		col.push({id: i, value: 0});
	    } 
	}
    }
};

//
// shortcuts for frequent placeholders in REST urls
// express puts parsed values in request object
//

// a bar's name must match [A-Za-z]+
app.param('name', function(req, res, next, name) {
    if (/^[A-Za-z]+$/.test(name)) {
	req.bars = Bars.get(name);
	next();
    } else {
	next('bar name does not match /[A-Za-z]+/');
    }
});

// a bar's index must be an integer number
app.param('index', function(req, res, next, index) {
    if (/^[0-9]+$/.test(index)) {
	req.barsIndex = parseInt(index);
	next();
    } else {
	next('index must be a number');
    }
});

//
// the urls called by backbone.js
//

// get one pair of a bar. Depends on "Accept" request header
app.get('/bars/:name/:index', function(req, res) {
    res.format({
	html: function() {
	    res.redirect('/');
	},

	json: function() {
	    Bars.ensureLength(req.bars, req.barsIndex);
	    res.json(200, req.bars[req.barsIndex]);
	}
    });
});


// get the whole bar. Depends on "Accept" request header
app.get('/bars/:name', function(req, res) {
    res.format({
	html: function() {
	    res.redirect('/');
	},

	json: function() {
	    res.json(200, req.bars);
	}
    });
});


// add a pair to a bar. Client must use "Content-Type: application/json"
// if there is an id use it, otherwise append to end
app.post('/bars/:name', function(req, res) {
    if (req.body.id) {
	Bars.ensureLength(req.bars, req.body.id);
	var val = {id: req.body.id, value: req.body.value};
	req.bars[req.body.id] = val;
	res.json(200, val);
    } else {
	var val = {id: req.bars.length, value: req.body.value};
	req.bars.push(val);
	res.json(200, val);
    }
});


// edit a specific pair. Client must use "Content-Type: application/json"
app.put('/bars/:name/:index', function(req, res) {
    Bars.ensureLength(req.bars, req.barsIndex);
    var val = {id: req.barsIndex, value: req.body.value};
    req.bars[req.barsIndex] = val;
    res.json(200, val);
});


//
// start the server
//
app.listen(8080);
