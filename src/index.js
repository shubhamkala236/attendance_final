const express = require("express");

// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
const { CreateChannel } = require("./utils");
const { PORT } = require("./config");
const { databaseConnection } = require("./database/index");
// const cookieParser = require('cookie-parser');
// const { employee } = require('./api');
const expressApp = require("./express-app");

const StartServer = async () => {
	const app = express();

	await databaseConnection();

	const channel = await CreateChannel();

	await expressApp(app, channel);

	app
		.listen(PORT || 8002, () => {
			console.log("Connected to backend");
			console.log(PORT);
		})
		.on("error", (err) => {
			console.log(err);
			process.exit();
		});
};

StartServer();
