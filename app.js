const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5000;
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/User_authentication', {
  useNewUrlParser: true, 
  // useUnifiedTopology: true, 
  
});


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});



app.use(bodyParser.json());

const userSchema = new mongoose.Schema({
  state: String,
  barRegistrationNumber: String,
  username: String,
  dateOfBirth: String,
  gender: String,
  casesDealtWith: String,
  yearsOfExperience: Number,
  courtType: String,
  mobileNumber: String,
  email: String,
  password: String,
});

const Advocate = mongoose.model('Advocate', userSchema);
const User = mongoose.model('User', userSchema);
const Registrar = mongoose.model('Registrar', userSchema);

app.post('/api/register2', async (req, res) => {
  const clientData = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(clientData.password, 10);

    // Create a new advocate with the hashed password
    const newClient = new User({
      state: clientData.state,
      barRegistrationNumber: clientData.barRegistrationNumber,
      username: clientData.username,
      dateOfBirth: clientData.dateOfBirth,
      gender: clientData.gender,
      yearsOfExperience: clientData.yearsOfExperience,
      casesDealtWith: clientData.casesDealtWith,
      courtType: clientData.courtType,
      email: clientData.email,
      mobileNumber: clientData.mobileNumber,
      password: hashedPassword, // Store the hashed password
    });

    // Save the advocate to the database
    await newClient.save();

    res.json({ success: true, message: 'Advocate registration successful' });
  } catch (error) {
    console.error('Error during advocate registration:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/api/register3', async (req, res) => {
  const RegistrarData = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(RegistrarData.password, 10);

    // Create a new advocate with the hashed password
    const newRegistrar = new Registrar({
      state: RegistrarData.state,
      barRegistrationNumber: RegistrarData.barRegistrationNumber,
      username: RegistrarData.username,
      dateOfBirth:RegistrarData.dateOfBirth,
      gender: RegistrarData.gender,
      yearsOfExperience: RegistrarData.yearsOfExperience,
      casesDealtWith: RegistrarData.casesDealtWith,
      courtType: RegistrarData.courtType,
      email:RegistrarData.email,
      mobileNumber:RegistrarData.mobileNumber,
      password: hashedPassword, // Store the hashed password
    });

    // Save the advocate to the database
    await newRegistrar.save();

    res.json({ success: true, message: 'Advocate registration successful' });
  } catch (error) {
    console.error('Error during advocate registration:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res.status(409).json({ success: false, message: 'Username already exists' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await User.create(newUser);
      console.log('User signup success');
      res.json({ success: true });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/api/signup2', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingRegistrar = await Registrar.findOne({ username });

    if (existingRegistrar) {
      res.status(409).json({ success: false, message: 'Username already exists' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newRegistrar = new Registrar({ username, password: hashedPassword });
      await Registrar.create(newRegistrar);
      console.log('User signup success');
      res.json({ success: true });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/api/login2', async (req, res) => {
  const { username, password } = req.body;

  try {
    const registrar = await Registrar.findOne({ username });

    if (registrar && (await bcrypt.compare(password, registrar.password))) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/api/signup3', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingAdvocate = await Advocate.findOne({ username });

    if (existingUser) {
      res.status(409).json({ success: false, message: 'Username already exists' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdvocate = new Advocate({ username, password: hashedPassword });
      await Advocate.create(newAdvocate);
      console.log('User signup success');
      res.json({ success: true });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/api/login3', async (req, res) => {
  const { username, password } = req.body;

  try {
    const advocate = await Advocate.findOne({ username });

    if (advocate && (await bcrypt.compare(password, advocate.password))) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// for lists

app.post('/api/register', async (req, res) => {
  const advocateData = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(advocateData.password, 10);

    // Create a new advocate with the hashed password
    const newAdvocate = new Advocate({
      state: advocateData.state,
      barRegistrationNumber: advocateData.barRegistrationNumber,
      username: advocateData.username,
      dateOfBirth: advocateData.dateOfBirth,
      gender: advocateData.gender,
      yearsOfExperience: advocateData.yearsOfExperience,
      casesDealtWith: advocateData.casesDealtWith,
      courtType: advocateData.courtType,
      email: advocateData.email,
      mobileNumber: advocateData.mobileNumber,
      password: hashedPassword, // Store the hashed password
    });

    // Save the advocate to the database
    await newAdvocate.save();

    res.json({ success: true, message: 'Advocate registration successful' });
  } catch (error) {
    console.error('Error during advocate registration:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/api/advocates', async (req, res) => {
  try {
    const advocates = await Advocate.find();
    res.json(advocates);
  } catch (error) {
    console.error('Error fetching advocates:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'm78595322@gmail.com', // Your Gmail email address
    pass: 'ycwc xxpx oqre wtun', // Your Gmail email password
  },
});

// Function to generate a random OTP
const generateOTP = () => {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }

  return otp;
};

app.post('/api/send-otp', async (req, res) => {
  const { mobileNumber, email } = req.body;

  // Generate OTPs
  const mobileOTP = generateOTP();
  const emailOTP = generateOTP();

  // Save OTPs to the database
  try {
    await OTP.create({ email, otp: emailOTP });
  } catch (error) {
    console.error('Error saving email OTP to the database:', error);
    return res.status(500).json({ error: 'Error saving email OTP' });
  }

  // Implement your logic to send mobile OTP (use SMS gateway or any other service)

  const mailOptions = {
    from: 'm78595322@gmail.com',
    to: email,
    subject: 'Your OTP for Verification',
    text: `Your One-Time Password (OTP) for registration is: ${emailOTP}`,
  };

  // Send email with OTP
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Error sending email' });
    } else {
      console.log('Email sent:', info.response);
      res.json({ success: true, message: 'OTP sent successfully' });
    }
  });
});


const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
});

const OTP = mongoose.model('OTP', otpSchema);

app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if the entered OTP matches the stored OTP
    const storedOTP = await OTP.findOne({ email, otp });

    if (storedOTP) {
      // If OTP is valid, you can perform additional actions here
      // For example, mark the email as verified in your user schema


      res.json({ success: true, message: 'OTP verified successfully' });
    } else {
      res.json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
