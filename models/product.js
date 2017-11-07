var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
});
userSchema.methods.encryptPasswor= function(password){
	return bcrypt.hashSync(password, bcrypt.getSaltSync(5), null);
};
userSchema.methods.validPassword= function(password){

	return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('Product', userSchema);