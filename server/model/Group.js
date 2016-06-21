/**
 * Created by olegba on 21/04/16.
 */
var mongoose = require('mongoose')



var groupSchema = mongoose.Schema({
  title: {type: String},
  created: Date,
  members: [{id: String, name: String}]
});

var Group = mongoose.model('Group', groupSchema);