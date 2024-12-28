const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

//json
app.use(express.json());

//cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});


app.use('/register', require('./routes/register'));

app.use('/HL7Messages', require('./routes/HL7Messages'))

app.use('/patient', require('./routes/patient' ))
app.use('/admin', require('./routes/admin'));
app.use('/dentist', require('./routes/dentist'))

//start server
const PORT = process.env.PORT || 3307; //3307 is the mapped port on my device to access.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
