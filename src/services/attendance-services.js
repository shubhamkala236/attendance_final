const { AttendanceRepository } = require("../database");
const { APIError } = require("../utils/app-errors");
const { APP_SECRET } = require("../config");
const { FormateData } = require("../api/middlewares/formate");

class AttendanceService {
	constructor() {
		this.repository = new AttendanceRepository();
	}

	//-------------------GenerateAttendance/Insert-----------------
	async RegisterAttendance(File) {
		try {
			const result = await this.repository.AttendanceInsert(File);
			return FormateData(result);
		} catch (error) {
			console.log(error);
			throw new APIError("Unable to create Employee attendance");
		}
	}

	//----------------------get Employee attendance --------------------
	async getEmployeeAttendance(id) {
		try {
			const result = await this.repository.getAttendance(id);
			// console.log(result);
			return FormateData(result);
		} catch (error) {
			console.log(error);
			throw new APIError("Unable to fetch Employee attendance");
		}
	}

	//----------------------get Employee attendance by id and month --------------------
	async getEmployeeAttendanceByMonth(id, month, year) {
		try {
			const result = await this.repository.getAttendanceByIdAndMonth(id, month, year);
			// console.log(result);
			return FormateData(result);
		} catch (error) {
			console.log(error);
			throw new APIError("Unable to fetch Employee attendance");
		}
	}

	//create payroll
	async createEmployeePayroll(employeeId, salaryDetail, month, year) {
		// console.log(salaryDetail);
		// console.log(employeeId);
		try {
			const result = await this.repository.getAttendanceCreate(
				employeeId,
				salaryDetail,
				month,
				year
			);
			// console.log(result);
			if (result) {
				return FormateData(result);
			}
		} catch (error) {
			console.log(error);
			throw new APIError("Unable to fetch Employee attendance");
		}
	}

	//create salary Slip
	async createEmployeeSalarySlip(employeeId, salaryDetail, userDetail, month, year) {
		console.log(salaryDetail);
		// console.log(userDetail);
		// console.log(employeeId);
		try {
			const result = await this.repository.salarySlipSchema(
				employeeId,
				salaryDetail,
				userDetail,
				month,
				year
			);
			// console.log(result);
			return FormateData(result);
		} catch (error) {
			console.log(error);
			throw new APIError("Unable to fetch Employee attendance");
		}
	}

	//----------------------get Employee Payroll --------------------
	async getEmployeePayroll(id) {
		try {
			const result = await this.repository.getPayroll(id);
			// console.log(result);
			return FormateData(result);
		} catch (error) {
			console.log(error);
			throw new APIError("Unable to fetch Employee attendance");
		}
	}

	//----------------------get Employee Payroll by month--------------------
	async getEmployeePayrollByMonth(id, month, year) {
		try {
			console.log({id,month,year});
			const result = await this.repository.getPayrollByMonth(id, month, year);
			console.log({result});
		
			return FormateData(result);
		} catch (error) {
			console.log(error);
			throw new APIError("Unable to fetch Employee attendance");
		}
	}

	async getEmployeeSalarySlipByMonthAndYear(id, month, year) {
		try {
			const result = await this.repository.getSalarySlipByMonthAndyear(id, month, year);
			// console.log(result);

			return FormateData(result);
		} catch (error) {
			console.log(error);
			throw new APIError("Unable to fetch Employee attendance");
		}
	}
	//get user salary slip by month and year -------------user
	async getEmployeeSalarySlipMonthYear(id, month, year) {
		try {
			const result = await this.repository.getSalarySlipByMonthAndyear(id, month, year);
			// console.log(result);

			return FormateData(result);
		} catch (error) {
			console.log(error);
			throw new APIError("Unable to fetch Employee attendance");
		}
	}

	//admimn get all salry slips of user
	async getEmployeeSalarySlipAll(id) {
		try {
			const result = await this.repository.getSalarySlipAllSlips(id);
			// console.log(result);

			return FormateData(result);
		} catch (error) {
			console.log(error);
			throw new APIError("Unable to fetch Employee attendance");
		}
	}

	//User get all salary slips of self--------user
	async getEmployeeSalarySlipAlluser(id) {
		try {
			const result = await this.repository.getSalarySlipAllSlips(id);
			// console.log(result);

			return FormateData(result);
		} catch (error) {
			console.log(error);
			throw new APIError("Unable to fetch Employee attendance");
		}
	}

	// //-------------------Generate Payroll-----------------
	// async CreatePayroll(Id){

	//     try{
	//         const result = await this.repository.AttendanceInsert(File);
	//         return FormateData(result);
	//     }catch(err){
	//         console.log(err);
	//         throw new APIError('Unable to create Employee attendance')
	//     }
	// }

	// -------------------Create salaryslip Schema----------------
	async createSalarySlipSchema(employeeId, salaryDetail, userDetail, month, year) {
		try {
			const result = await this.repository.salarySlipSchema(
				employeeId,
				salaryDetail,
				userDetail,
				month,
				year
			);
			console.log(result);
			return "true";
		} catch (error) {
			console.log(error);
			throw new APIError("Unable to fetch Employee attendance");
		}
	}

	//Events/services provided by attendance to other apis
	async SubscribeEvents(payload) {
		console.log("data");
		payload = JSON.parse(payload);

		const { event, data } = payload;

		const { employeeId, salaryDetail, userDetail, month, year } = data;
		const { Employee_id, Basic, HRA, Convince, LTA, SPL, PF_Employee, PF_Employer } = salaryDetail;

		switch (event) {
			case "TEST":
				console.log("WORKING FROM ATTENDANCE");
				break;

			case "createEmployeePayroll":
				this.createEmployeePayroll(employeeId, salaryDetail, month, year);
				break;
			case "getPdf":
				this.createEmployeeSalarySlip(employeeId, salaryDetail, userDetail, month, year);
				break;
			case "createSalarySlipSchema":
				this.createSalarySlipSchema(employeeId, salaryDetail, userDetail, month, year);
				break;

			default:
				break;
		}
	}
}

module.exports = AttendanceService;
