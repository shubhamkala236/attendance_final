const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PayrollModel = new Schema({
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
    Pf:{
        type:Number,
        required:true,
    },
    Esic:{
        type:Number,
        required:true,
    },
    deduction:{
        type:Number,
        required:true,
    },
    CIH:{
        type:Number,
        required:true,
    },
    LWF:{
        type:Number,
        required:true,
    },
    GPS:{
        type:Number,
        required:true,
    },

  
});

module.exports =  mongoose.model('payroll',PayrollModel);