var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

	mail: {type: String, required: true},
	password: {type: String, require: true}
});

module.exports= mongoose.model('User', userSchema);