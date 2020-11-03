const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Import routes
const authRoute = require('./routes/auth');

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    console.log('Connected to DB.');
});


//Middleware
app.use(express.json());

//Routes middlewares
app.use('/api/user', authRoute);

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});

