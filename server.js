require('dotenv').config()
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT =  process.env.PORT

// Middleware to parse JSON
app.use(express.json());

// User routes
app.use('/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

app.get('/',(req,res)=>{
    res.status(200).send("Welcome to User Profile MGMT");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
