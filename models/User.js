const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    }
});
  
const User = mongoose.model('User', UserSchema);

module.exports = User

  
  /*
  *   Test Model 
  */
  // const user = new User({ name: 'Michael', password: '12345' });
//   console.log(user.name, user.password); 