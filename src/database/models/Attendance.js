const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    month: {
        type: String,
        required: true,
      },
    year: {
        type: Number,
        required: true,
      },
    presentDays: {
        type: Number,
        required: true,
    },
    weekOffs:{
        type: Number,
        required: true,
    },
    leaves:{
        type: Number,
        required: true,
    },
    employeeId:{
        type: Number,
        required: true,
    },
  
});

module.exports =  mongoose.model('attendance',AttendanceSchema);
