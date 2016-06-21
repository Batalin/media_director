var mongoose = require('mongoose');

var assignmentSchema = mongoose.Schema({
    title: {type: String, required: '{PATH} is required!'},
    duration: String,
    input_number: Number,
    description: String,
    task: String
});

var Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports =  Assignment;


createTestAss = function() {
    Assignment.find({}).exec(function(err, collection){
        if(collection.length === 0) {
            Assignment.create({
                    title: "Test Assignment",
                    duration: "8.09",
                    input_number: 4,
                    description: "Test Assignment",
                    task: "Create output video from the input videos"
                });
        }
    })
}
//module.exports = createTestAss;
//module.exports =  Assignment;