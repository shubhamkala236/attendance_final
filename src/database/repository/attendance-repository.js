const { AttendanceModel,PayrollModel,SalarySlipModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-errors");
// const ApiFeatures = require("../../utils/apifeatures");
const path = require("path");
const render = require("xlsx");

class AttendanceRepository {
  async AttendanceInsert(File) {
    try {
      const fileName = File.name;
      const savePath = path.join(__dirname, "uploads", fileName);
      await File.mv(savePath);
      const readFile = render.readFile(savePath);
      //array of sheets
      const sheets = readFile.SheetNames;
      for (let i = 0; i < sheets.length; i++) {
        const sheetname = sheets[i];
        const sheetData = render.utils.sheet_to_json(
          readFile.Sheets[sheetname]
        );
        // console.log(sheetData);

        sheetData.forEach(async (key) => {
          const Month = sheetname;
          const employeeId = key.Employee_id;
          const year = key.Year;
          var present_val = 0;
          var leave_val = 0;
          var weekOff_val = 0;
          //iterating over each valueof each employee object
          for (let val in key) {
            // console.log(val,key[val]);
            if (key[val] == "P") {
              present_val++;
            } else if (key[val] == "L") {
              leave_val++;
            } else if (key[val] == "W") {
              weekOff_val++;
            }
          }
          // console.log("Data for p l w",present_val,leave_val,weekOff_val);

          const presentDays = present_val;
          const weekOffs = weekOff_val;
          const Leaves = leave_val;
          // console.log(Month,employeeId,presentDays,weekOffs,Leaves,year);
          // console.log(key);

          const Employee = await AttendanceModel.create({
            month: Month,
            presentDays: presentDays,
            weekOffs: weekOffs,
            leaves: Leaves,
            employeeId: employeeId,
            year: year,
          });
          if (!Employee) {
            return { data: "cannot create attendance" };
          }
        });
      }
      return { newData: "employee attendance submitted" };
    } catch (err) {
      console.log(err);
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Attendance"
      );
    }
  }

  //get user attendance
  async getAttendance(id) {
    try {
      const attendanceDetail = await AttendanceModel.find({
        employeeId: id,
      });
      // console.log(attendanceDetail);
      return attendanceDetail;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Employee"
      );
    }
  }
 
  //get user attendance by id and month 
  async getAttendanceByIdAndMonth(id,month,year) {
    try {
      const attendanceDetail = await AttendanceModel.findOne({
        employeeId: id,
        month:month,
        year:year
      });
      // console.log(attendanceDetail);
      return attendanceDetail;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Employee"
      );
    }
  }
  
  //get user Payroll- All
  async getPayroll(id) {
    try {
      const PayrollDetail = await PayrollModel.find({
        employeeId: id,
      });
      // console.log(PayrollDetail);
      return PayrollDetail;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Payroll"
      );
    }
  }
  
  //get user Payroll- by month
  async getPayrollByMonth(id,month,year) {
    try {
      const PayrollDetail = await PayrollModel.findOne({
        employeeId: id,
        month:month,
        year:year
      });

      console.log(PayrollDetail);
      return PayrollDetail;
    } catch (err) {
      console.log(err);
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Payroll"
      );
    }
  }
  //get user SalarySlip - by month & year -------admin
  async getSalarySlipByMonthAndyear(id,month,year) {
    try {
      const getSlip = await SalarySlipModel.findOne({
        employeeId: id,
        month:month,
        year:year
      });
      if(getSlip){
        return getSlip;
      }
      else{
        return {message:"Salary slip not generated"};
      }
     
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find slip"
      );
    }
  }

  //get user SalarySlip All slips -------admin
  async getSalarySlipAllSlips(id) {
    try {
      const getSlip = await SalarySlipModel.findOne({
        employeeId: id
      });
      if(getSlip){
        return getSlip;
      }
      else{
        return {message:"Salary slip not generated"};
      }
     
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find slip"
      );
    }
  }
  //----------------------microservice------------------------//

  //get user attendance and create with salary received from employee
  async getAttendanceCreate(userId,salaryDetail,month,year) {
    try {
      // console.log(salaryDetail);
      //getting attendance
      const attendanceDetail = await AttendanceModel.findOne({
      employeeId: userId,
      month:month,
      year:year
      });
      // console.log(attendanceDetail);
      if(!attendanceDetail){
        return {message:"Cannot generate Payroll"};
      }

      console.log(salaryDetail.data);
      //getting salary details
      const {PF_Employee,Basic,HRA,Convince,LTA,SPL,PF_Employer,Employee_id,ESIC_Employer,ESIC_Employee,TDS,MEDICAL,PF_NUMBER,ESIC_NUMBER,LWF_Employer} = salaryDetail.data;
      //calculation for payroll of user
      // console.log(Basic);
      var totalMonthDays = 0;
      if(attendanceDetail.month === 'January' || 'March' || 'May' || 'July' || 'August' || 'September' || 'October' || 'December'){
        totalMonthDays = 31;
      }else if(attendanceDetail.month === 'April' ||  'June' || 'September' || 'November'){
        totalMonthDays = 30;
      }else if(attendanceDetail.month === 'Febuary'){
        totalMonthDays = 28; 
      }
      // console.log(totalMonthDays);
      var WorkingDays = totalMonthDays - attendanceDetail.weekOffs;
      var effectiveWorkingDays = 0;
      var effectiveWorkingDays = WorkingDays - attendanceDetail.leaves;
      var gross = 0;
      var gross = Basic+HRA+MEDICAL+LTA+SPL; //gps
      console.log(gross,Basic,HRA,MEDICAL,LTA,SPL);

      var LOP = 0;
      var LOP  = (gross/WorkingDays)*attendanceDetail.leaves;

      var GPS = 0;
      //GROSS PAYABLE SALARY 
      if(attendanceDetail.month === 'January' || 'March' || 'May' || 'July' || 'August' || 'September' || 'October' || 'December'){
         GPS = gross*(attendanceDetail.presentDays + attendanceDetail.weekOffs)/31;
      }
      else if(attendanceDetail.month === 'April' ||  'June' || 'September' || 'November'){
        GPS = gross*(attendanceDetail.presentDays + attendanceDetail.weekOffs)/30;
      }
      else if(attendanceDetail.month === 'Febuary'){
        GPS = gross*(attendanceDetail.presentDays + attendanceDetail.weekOffs)/28; 
      }
      var deduction = 0;
      var cih = 0;
      var lwf = 0;
      
      
      //deduction
      var esic = 0;
      if(gross <= 2000 ){
        esic = (gross*2)/100;
      }
      var lwf = (gross*2)/100;
      
      console.log(deduction,lwf,cih,GPS);
      //PF
      var pf = 0;
      if(Basic<=1200){
        pf = (Basic*12)/100;
      }
      else{
        pf = 0
      }
      //deductions
      
      var deduction = pf + esic + lwf + TDS;
      var cih = gross - deduction;

      //-------------------calculation done here above---------------

      
        //if attendance found then create payroll of that user with help of salary received from employee
        const payrollGenerate = new PayrollModel({
          month: attendanceDetail.month,
          presentDays: attendanceDetail.presentDays,
          weekOffs: attendanceDetail.weekOffs,
          leaves: attendanceDetail.leaves,
          employeeId: attendanceDetail.employeeId,
          year: attendanceDetail.year,
          Pf:PF_Employee,
          Esic:ESIC_Employee,
          deduction:deduction,
          CIH:cih,
          LWF:lwf,
          GPS:GPS,
        });
        
        const result = await payrollGenerate.save();
        console.log(result);
        return result;
  
    } catch (err) {
      throw err.message;
    }
  }


  //generating salary slip
  async salarySlipSchema(userId,salaryDetail,userDetail,month,year) {
    //search payroll if that payroll is present to generate salary slip
    try {
    const payRollDetail = await PayrollModel.findOne({
      employeeId: userId,
      month:month,
      year:year
      });
      //check if attendance is present or not
      const attendanceDetail = await AttendanceModel.findOne({
        employeeId: userId,
        month:month,
        year:year
        });
        console.log(userDetail);
        if(!attendanceDetail){
          return {message:"Cannot generate Slip"};
        }

      if(!payRollDetail){
        return {message:"Cannot generate Slip please register payroll first"};
      }
      
      //now we have payrolldetail , userInfo , salaryDetails using these create field for pdf
      const {PF_Employee,Basic,HRA,Convince,LTA,SPL,PF_Employer,Employee_id,ESIC_Employer,ESIC_Employee,TDS,MEDICAL,PF_NUMBER,ESIC_NUMBER,LWF_Employer} = salaryDetail.data;
      const {name,email,dateOfBirth,phoneNumber,current_address,perma_address,adhaarNumber,panNumber,bankAccountNumber,ifsc,passBookNumber,designation,dateOfJoining,department} = userDetail.data;

      
      //---------------------------------------Calculations---------------------------------------------//
      //calculation for salaryslip of user
      // console.log(Basic);
      var totalMonthDays = 0;
      if(attendanceDetail.month === 'January' || 'March' || 'May' || 'July' || 'August' || 'September' || 'October' || 'December'){
        totalMonthDays = 31;
      }else if(attendanceDetail.month === 'April' ||  'June' || 'September' || 'November'){
        totalMonthDays = 30;
      }else if(attendanceDetail.month === 'Febuary'){
        totalMonthDays = 28; 
      }

      var WorkingDays = totalMonthDays - attendanceDetail.weekOffs;
      var effectiveWorkingDays = WorkingDays - attendanceDetail.leaves;

      var gross = Basic+HRA+MEDICAL+LTA+SPL; //gps

      var LOP  = (gross*attendanceDetail.leaves)/WorkingDays;

      var GPS = 0;
      //GROSS PAYABLE SALARY 
      if(attendanceDetail.month === 'January' || 'March' || 'May' || 'July' || 'August' || 'September' || 'October' || 'December'){
         GPS = gross*(attendanceDetail.presentDays + attendanceDetail.weekOffs)/31;
      }
      else if(attendanceDetail.month === 'April' ||  'June' || 'September' || 'November'){
        GPS = gross*(attendanceDetail.presentDays + attendanceDetail.weekOffs)/30;
      }
      else if(attendanceDetail.month === 'Febuary'){
        GPS = gross*(attendanceDetail.presentDays + attendanceDetail.weekOffs)/28; 
      }
      //deduction
      var esic = 0;
      if(gross <= 2000 ){
        esic = (gross*2)/100;
      }
      var lwf = (gross*2)/100;

      //PF
      var pf = 0;
      if(Basic<=1200){
        pf = (Basic*12)/100;
      }
      else{
        pf = 0
      }
      //deductions
      var deduction = pf + esic + lwf + TDS;
      var cih = gross - deduction;

      //---------------------------------------------------Calculations Finished------------------------------------------//
      //using above generated details to generate pdf
      //store in salary slip schema

      const salarySlip = new SalarySlipModel({
        month: attendanceDetail.month,
        presentDays: attendanceDetail.presentDays,
        weekOffs: attendanceDetail.weekOffs,
        leaves: attendanceDetail.leaves,
        employeeId: attendanceDetail.employeeId,
        year: attendanceDetail.year,
        Pf:pf,
        PF_NUMBER:PF_NUMBER,
        ESIC_NUMBER:ESIC_NUMBER,
        PF_Employee:PF_Employee,
        PF_Employer:PF_Employer,
        Employee_id:Employee_id,
        ESIC_Employee:ESIC_Employee,
        ESIC_Employer:ESIC_Employer,
        TDS:TDS,
        Esic:esic,
        deduction:deduction,
        CIH:cih,
        LWF:lwf,
        GPS:GPS,
        Basic:Basic,
        HRA:HRA,
        LTA:LTA,
        SPL:SPL,
        name:name,
        dateOfJoining:dateOfJoining,
        designation:designation,
        department:department,
        panNumber:panNumber,
        adhaar:adhaarNumber,
        MEDICAL:MEDICAL,
        gross:gross,
        LOP:LOP,
        effectiveWorkingDays:effectiveWorkingDays,
        LWF_Employer:LWF_Employer,
      });

      const result = await salarySlip.save();
        console.log(result);
        
        return result;

      } catch (error) {
        throw new APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Unable to Find Employee"
        );
          
      }
          








  }



      
}
module.exports = AttendanceRepository;
