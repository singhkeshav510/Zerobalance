const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const colors = require('colors');
const cookieParser = require('cookie-parser'); 
const bcrypt = require("bcryptjs");
const errorHandler = require('./middlewares/error');
const User = require('./models/User')
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json');
const ErrorResponse = require('./utils/errorResponse');


// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

const allRoutes = require('./routes/index');
app.use(cors())

app.use(express.json());

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

app.use(cookieParser());

// Documentation
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', allRoutes);

app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
