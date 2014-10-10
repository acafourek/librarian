// server.js - major thnaks to http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4

/*
API overview:

/items
		- POST: create new book record
		- GET: retrieve all items

*/

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 		// set our port

//DB connection
var mongoose   = require('mongoose');
mongoose.connect('mongodb://librarian_master:g!DVum3ayG@proximus.modulusmongo.net:27017/usasO6du'); // connect to our database

var Book     = require('./app/models/book.js');


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router


// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

	//API METHODS FOR GENERAL ITEMS
	router.route('/items')

	// create an item (accessed at POST http://localhost:8080/api/items)
	.post(function(req, res) {
		
		var item = new Book(); 		// create a new instance of the Item model
		
		var body = req.body;	
		for(var key in body) { 		//iterate through the call and build the item record
		   if (body.hasOwnProperty(key)) {
		   		item[key] = body[key];
		   }
		}
		console.log(item);

		// save the item and check for errors
		item.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Item created!' });
			console.log(res.body);
		});
		
	})
	
	// get all the books (accessed at GET http://localhost:8080/api/items)
	.get(function(req, res) {
		Book.find(function(err, items) {
			if (err)
				res.send(err);

			res.json(items);
		});
	});
	
	///METHIDS FOR SINGLE ITEMS
	router.route('/items/:id')

	// get the item with that id (accessed at GET http://localhost:8080/api/items/:id)
	.get(function(req, res) {
		Book.findById(req.params.id, function(err, item) {
			if (err)
				res.send(err);
			res.json(item);
		});
	})
	
	// update the item with this id (accessed at PUT http://localhost:8080/api/items/:id)
	.put(function(req, res) {

		// use our bear model to find the bear we want
		Book.findById(req.params.id, function(err, item) {

			if (err)
				res.send(err);

			item.title = req.body.title; 	// update the item info

			// save the bear
			item.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Book updated!' });
			});

		});
	})
	
	// delete the item with this id (accessed at DELETE http://localhost:8080/api/items/:id)
	.delete(function(req, res) {
		var ids = req.params.id.split(",");

		var deleted = [];
		var errors = [];
		//iterate through all passed ids in order to delete them
		for (var i = 0; i < ids.length; i++) {
			Book.remove({
				_id: ids[i]
			}, function(err, item) {
				if (err)
					errors.push(err);
				deleted.push(ids[i]); 
				
				if(i == ids.length){
					var result = {
						'message': deleted.length+' Records deleted',
						'Deleted': deleted, 
						'Errors:': errors
					};
					res.json(result);
				}
								
			});
		}		
	});
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api/v1', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);