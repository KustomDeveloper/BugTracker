const mongoose = require("mongoose");

const BugSchema = new mongoose.Schema({
    bug_name: {
        type: String,
        required: true
    },
    assigned_to: {
        type: String,
        required: true
    },
    created_date: {
        type: String,
        required: true
    },
    due_date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});
  
const Bug = mongoose.model('Bug', BugSchema);

module.exports = Bug