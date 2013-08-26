
// backbone.js Model
// each Bar contains a single integer value
var Bar = Backbone.Model.extend({
    defaults: {
	value: 0
    }
});


// backbone.js View
// each Bar is rendered as a rectangular black bar
var BarView = Backbone.View.extend({
    tagName: 'div',
    className: 'bar',

    initialize: function() {
	// bind the model with the view.
	// whenever the model changes value render again
	this.listenTo(this.model, "change", this.render);
    },

    render: function() {
	// a simple renderer. A bar is just an empty div filled
	// with the background color.
	this.el.style.width = '' + this.model.get('value') + '%';
	return this;
    }
});


// the bubble sort algorithm.
// after every iteration it waits some time
// to make the animation more smooth 
function BubbleSort(col) {
    var all_swaps = 0; // sum of it_swaps

    var iteration = function() {
	var it_swaps = 0; // swaps per iteration

	for (var i = 0; i < col.length - 1; i++) {
	    var v1 = col.at(i).get('value');
	    var v2 = col.at(i + 1).get('value');
	    if (v1 > v2) {
		it_swaps++;
		var tmp = v1;
		col.at(i).set('value', v2);
		col.at(i + 1).set('value', tmp);
	    }
	}
	all_swaps += it_swaps;
	if (it_swaps > 0) {
	    setTimeout(iteration, 150);
	} else if (all_swaps > 0) {
	    // the sorting finished, so save the list to the server
	    // we could have done this during the animation but
	    // it would make the graphics very slow, so for
	    // aesthetic reasons we do it now
	    // we check for total swaps to avoid resyncing
	    // if the user just pushed the back button to go
	    // to a previously sorted list
	    col.forEach(function(model, index, collection) {
		model.save();
	    });

	}
    };
    setTimeout(iteration, 500);
}


function BubbleSortDemo(name) {
    // a backbone.js collection to hold Bars
    // backbone.js syncs the changes in this collection
    // and its models with the views using events
    // and with the server using ajax implicitly
    var bars = new Backbone.Collection([], {
	model: Bar,
	url: '/bars/' + name
    });

    // get the div for the bars
    var $dt = $('#draw-target');

    // backbone.js callbacks for the collection
    // 'reset' is triggered when all the elements are added. Use it to set the views
    // 'sync' is triggered when synced with the server. Use it to start animation
    bars.on('reset', function(model, collection, option) {
	bars.forEach(function(model, index, collections) {
	    var view = new BarView({
		model: model,
		attributes: {style: 'left: 0px; top: ' + ((index << 2) + 8) + 'px;'}
	    });
	    view.render();
	    $dt.append(view.$el);
	});
    });

    bars.on('sync', function(col, response, option) {
	BubbleSort(bars);
    });

    // get the collection from the server. If this is a new name,
    // the result is a list of 100 random numbers in [0,100]
    bars.fetch({reset: true});
}


// backbone.js router
// whenever the user changes the fragment part of the url (#..)
// it fires the callback associated with the new url
var BarRouter = Backbone.Router.extend({
    routes: {
	'bars/:name': BubbleSortDemo
    } 
});


// initialize the router, bind click() to form and start application
$(function() {
    var router = new BarRouter();
    Backbone.history.start();

    $('#sortButton').click(function() {
	var name = $('#barsName').val();
	if (/^[A-Za-z]+$/.test(name)) {
	    router.navigate('bars/' + name, { trigger: true });
	} else {
	    alert('name must contain only [A-Za-z]');
	}
    });
});
