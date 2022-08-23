const AttendanceService = require('../services/attendance-services');
const { APIError, STATUS_CODES } = require("../utils/app-errors");


module.exports = (app) => {

    const service = new AttendanceService(); 
     
    app.use('/app-events', async (req,res,next) => {
        try {
            const { payload } = req.body;
            // console.log(payload.data.salaryDetail);
            const data = await service.SubscribeEvents(payload);
            if(!data){
                return res.status(200).json({status:"failure",message:"Employee Payroll cannot be generated"});
            }
            console.log("===============  ATTENDANCE Service Received Event  ====== ");
            return res.status(200).json({status:"success",message:"Employee Payroll generated"});
            
        } catch (error) {
            next(error);
        }

    });

}