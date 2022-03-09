const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    project_name: {
        type: String,
        required: true
    },
    project_owner: {
        type: String,
        required: true
    }
});
  
const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project


