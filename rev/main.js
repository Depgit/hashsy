const express = require('express');
const bodyParser = require('body-parser');
const db = require('./singletons/db');
const app = express();
const User = require('./services/user')
require("dotenv").config();
const {userLogger, timeLogger} = require('./singletons/logger')
const cron = require('node-cron');
const morgan = require('morgan')
app.use(bodyParser.json());

let startTime  = new Date();

// Heartbeat returns details of the instance running
const Heartbeat = () => {
	let newTime = new Date();
    uptime = newTime.getHours() - startTime.getHours();
    timeLogger.info("uptime is ",uptime);
    return;
}

/*
@title Hashsy API
@version 1.0
@description These APIs will be consumed by frontend applications.
@termsOfService `https://hashsy.app/terms`  (currently not working)

@contact.email depcoder@gmail.com

@license.name Firebase
@license.url Firebase.com

@BasePath /v1
*/

cron.schedule('* * * * *', () => {
  timeLogger.info('[main.js] : running a task every minute');
});

app.use(morgan('dev'))
app.use('/v1',User)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
