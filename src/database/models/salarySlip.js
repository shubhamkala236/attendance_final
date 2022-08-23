const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SalarySlipSchema = new Schema({
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
    PF_NUMBER:{
        type:Number,
        required:true,
    },
    ESIC_NUMBER:{
        type:Number,
        required:true,
    },
    PF_Employee:{
        type:Number,
        required:true,
    },
    PF_Employer:{
        type:Number,
        required:true,
    },
    ESIC_Employee:{
        type:Number,
        required:true,
    },
    ESIC_Employer:{
        type:Number,
        required:true,
    },
    TDS:{
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
    Basic:{
        type:Number,
        required:true,
    },
    HRA:{
        type:Number,
        required:true,
    },
    LTA:{
        type:Number,
        required:true,
    },
    SPL:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    dateOfJoining:{
        type:String,
        required:true,
    },
    designation:{
        type:String,
        required:true,
    },
    panNumber:{
        type:Number,
        required:true,
    },
    adhaar:{
        type:Number,
        required:true,
    },
    MEDICAL:{
        type:Number,
        required:true,
    },
    department:{
        type:String,
        required:true,
    },
    gross:{
        type:Number,
        required:true,
    },
    LOP:{
        type:Number,
        required:true,
    },
    effectiveWorkingDays:{
        type:Number,
        required:true,
    },
    LWF_Employer:{
        type:Number,
        required:true,
    },

  
});

module.exports =  mongoose.model('salarySlips',SalarySlipSchema);