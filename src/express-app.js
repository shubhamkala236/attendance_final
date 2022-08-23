const express = require('express');
const upload = require('express-fileupload');
const cors  = require('cors');
const cookieParser = require('cookie-parser');
const { attendance, appEvents  } = require('./api');
const HandleErrors = require('./utils/error-handler')





module.exports = async (app,channel) => {
    app.use(cors());
    app.use(express.json());    
    app.use(cookieParser())
    app.use(upload());
    
    app.use(express.urlencoded({ extended: true }));

    // //Listeners
    // appEvents(app);

    //api
    attendance(app,channel);

    // error handling
    app.use(HandleErrors);
    
}