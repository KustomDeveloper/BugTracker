const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
  
const User = mongoose.model('User', UserSchema);

module.exports = User
  
  /*
  *   Test Model 
  */
  // const user = new User({ name: 'Michael', password: '12345' });
//   console.log(user.name, user.password); 