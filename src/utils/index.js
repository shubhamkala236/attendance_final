// const bcrypt = require('bcryptjs');
// const jwt  = require('jsonwebtoken');
// const Sib = require('sib-api-v3-sdk');
const { SubscribeEvents } = require("../services/attendance-services");

// const nodeMailer = require('nodemailer');
const amqplib = require("amqplib");
// const axios = require('axios');

const {
	APP_SECRET,
	MESSAGE_BROKER_URL,
	EXCHANGE_NAME,
	QUEUE_NAME,
	Attendance_BINDING_KEY,
} = require("../config");

//Utility functions
(module.exports.GenerateSalt = async () => {
	return await bcrypt.genSalt();
}),
	(module.exports.GeneratePassword = async (password, salt) => {
		return await bcrypt.hash(password, salt);
	});

module.exports.ValidatePassword = async (enteredPassword, savedPassword, salt) => {
	return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

(module.exports.GenerateSignature = async (payload) => {
	return await jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
}),
	(module.exports.ValidateSignature = async (req) => {
		const signature = req.get("Authorization");

		console.log(signature);

		if (signature) {
			const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
			req.user = payload;
			return true;
		}

		return false;
	});

module.exports.FormateData = (data) => {
	if (data) {
		return { data };
	} else {
		throw new Error("Data Not found!");
	}
};

//Message broker to publish events and send payload

//create channel
module.exports.CreateChannel = async () => {
	try {
		const connection = await amqplib.connect(MESSAGE_BROKER_URL);
		const channel = await connection.createChannel();
		await channel.assertExchange(EXCHANGE_NAME, "direct", false);
		return channel;
	} catch (error) {
		throw error;
	}
};

//publish events/messages/payload send

module.exports.PublishMessage = async (channel, binding_Key, message) => {
	try {
		await channel.publish(EXCHANGE_NAME, binding_Key, Buffer.from(message));
		console.log("send data");
	} catch (error) {
		throw error;
	}
};

//subscribe messages

//     module.exports.SubscribeMessage = async(channel,service) => {
//         // console.log(service);
//         try {
//                 const appQueue = await channel.assertQueue(QUEUE_NAME);

//                 channel.bindQueue(appQueue.queue,EXCHANGE_NAME,Attendance_BINDING_KEY)

//                 channel.consume(appQueue.queue,data=>{
//                         // console.log(data);
//                         console.log("Received data");
//                         console.log(data.content.toString())
//                         service.SubscribeEvents(data.content.toString())
//                         // service.SubscribeEvents(data.content.toString())

//                         channel.ack(data);
//                 })

//         } catch (error) {
//                 throw error;
//         }

//     }

module.exports.SubscribeMessage = async (channel, service) => {
	console.log("===============DAATA==============");
	try {
		const appQueue = await channel.assertQueue(QUEUE_NAME);

		channel.bindQueue(appQueue.queue, EXCHANGE_NAME, Attendance_BINDING_KEY);
		console.log(appQueue);
		await channel.consume(appQueue.queue, (data) => {
			console.log("Received data");
			console.log(data.content.toString());
			service.SubscribeEvents(data.content.toString());

			channel.ack(data);
		});
	} catch (error) {
		throw error;
	}
};
