const express = require('express');
const connectDB = require('./config/db');

//Initialize express into app
const app = express();

//Connect to Database
connectDB();

//Init middleware(Including this we can use req.json)
app.use(express.json({extended:false}));

//Define Routes(Include all the routes)
app.use('/api/users',require('./routes/users'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/contacts',require('./routes/contacts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => console.log(`Server Running at PORT ${PORT}`));
