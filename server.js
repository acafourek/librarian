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
//=============================

/***
	CREATE ITEM
	- POST api/v1/items
**/
	.post(function(req, res) {
		
		var item = new Book(); 		// create a new instance of the Item model
		
		var body = req.body;	
		for(var key in body) { 		//iterate through the call and build the item record
		   if (body.hasOwnProperty(key)) {
		   		item[key] = body[key];
		   }
		}

		// save the item and check for errors
		item.save(function(err) {
			if (err)
				res.send({message: 'There was an error.','error':err });

			res.json({ message: 'Item created!' });
			console.log(res.body);
		});
		
	})

/***
	GET ALL ITEMS
	- GET api/v1/items
**/	
	.get(function(req, res) {
		Book.find(function(err, items) {
			if (err)
				res.send(err);

			res.json(items);
		});
	});
	

//SINGLE ITEMS
//=============================
	router.route('/items/:id')

/***
	GET ITEMS BY ID
	- GET api/v1/items/:ID
	- Accepts comma separated list of IDs
**/
	.get(function(req, res) {
		var ids = req.params.id.split(",");

		Book.find({
		    '_id': { $in: ids}
		}, function(err, items){
			if (err)
				res.send(err);
			res.json(items);
		});
	})

/***
	UPDATE SINGLE ITEM BY ID
	- PUT api/v1/items/:ID
**/
	.put(function(req, res) {

		Book.findById(req.params.id, function(err, item) {

			if (err)
				res.send(err);

			for(var key in req.body) { 		//iterate through the call and build the item record
			   if (req.body.hasOwnProperty(key)) {
			   		item[key] = req.body[key];
			   }
			}	// update the item info

			// save the bear
			item.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Book updated!' });
			});

		});
	})

/***
	DELETE ITEMS BY ID
	- DELETE api/v1/items/:ID
	- Accepts comma separated list of IDs
**/
	.delete(function(req, res) {
		var ids = req.params.id.split(",");		

		Book.remove({
		    '_id': { $in: ids}
		}, function(err, result){
			if (err)
				res.send(err);
			var response = {
				'message': 'Items deleted.',
				'items': 	ids
			}
			res.json(response);
		});
	});


//API METHODS FOR BUILDING METADATA PROFILE
	router.route('/items')
//=============================

// REGISTER OUR ROUTES -------------------------------
app.use('/api/v1', router); //add v1 prefix for all requests

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);