// app/models/bear.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AuthorSchema = new Schema({ 
		name: String,				//Author name
		id: Number,					//Unique Author ID
		alias: Array				//Other names for this author?
	});
	
var SubjectSchema = new Schema({ 
		subject: String,
		id: Number,
		parentID: Number
	});

var SeriesSchema = new Schema({ 
		name: String,
		id: Number,
		numInSeries: Number
	});

var VolSchema = new Schema({ 
		volume: String,			//Number for this volume
		NumOfVolumes: String	//Total number of volumes available
	});

var ItemSchema   = new Schema({
	title:  String,					//Book Title
	authors: [AuthorSchema],		//Author Array
	contributors: [AuthorSchema],	//Contrib Array
	desc:   String,					//Book description
	pubDate: Date,					//Publication Data
	copyright: String,				//Copyright Year
	coverImage: String,				//Url to cover image
	isbn_10: String,				//ISBN 10
	isbn_13: String,				//ISBN 13
	publisher: [AuthorSchema],		//Publisher Data Name
	imprint: String,				//Imprint name
	updatedate: { 
		type: Date, 				//Last time this record was updated
		default: Date.now 
	},
	series:	[SeriesSchema],			//Array of series info
	subject: [SubjectSchema],		//Array of subject info
	meta: {
		pages: Number,				//Page count
		volumeInfo: [VolSchema],
		edition: String,			//Edition number
		lang: String,				//Language code
		mediaType: String			//Media type
	}
});

module.exports = mongoose.model('Item', ItemSchema);
