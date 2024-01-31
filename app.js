const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs/promises');
const bcrypt = require('bcrypt');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');


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
  district: String,
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
      district: RegistrarData.district,
      username: RegistrarData.username,
      dateOfBirth: RegistrarData.dateOfBirth,
      gender: RegistrarData.gender,
      courtType: RegistrarData.courtType,
      email: RegistrarData.email,
      mobileNumber: RegistrarData.mobileNumber,
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
      // Include the username in the success response
      res.json({ success: true, username: user.username });
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
      res.json({ success: true, username: registrar.username });
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

    if (existingAdvocate) {
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
      res.json({ success: true, username: advocate.username });
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
      district: advocateData.district,
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

const caseSchema = new mongoose.Schema({
  caseType: String,
  district: String,
  plaintiffName: String,
  plaintiffFatherOrMotherName: String,
  plaintiffAge: String,
  plaintiffCaste: String,
  plaintiffAdvocate: String,
  defendantName: String,
  defendantFatherOrMotherName: String,
  defendantAge: String,
  defendantCaste: String,
  dmobileNumber: String,
  pmobileNumber: String,
  plaintiffAddress: String,
  defendantAddress: String,
  plaintiffEmail:String,
  subject: String,
  filingDate: String,
  issuedDay: String,
  issuedDate: String,
  issuedTime: String,
  count: {
    type: Number,
    default: 1,
  },
  cnrNumber: {
    type: String,
    unique: true,
    default: () => uuidv4(),
  },
  progressLevel: {
    type: String,
    default: 'firstCourt',
  },
  judge: String,          
  decision: String,      
  decisionDate: String,
});

const CaseModel = mongoose.model('Case', caseSchema);

app.post('/api/cases', async (req, res) => {
  const formData = req.body;

  try {
    // Create a new case instance with the provided form data              
    const newCase = new CaseModel(formData);

    // Save the new case to the database             
    await newCase.save();

    res.json({ success: true, message: 'Case filed successfully!' });
  } catch (error) {
    console.error('Error filing case:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/api/update-progress', async (req, res) => {
  const { caseId, progressLevel } = req.body;

  try {
    // Update the progress level of the specified case
    const updatedCase = await CaseModel.findByIdAndUpdate(
      caseId,
      { $set: { progressLevel } },
      { new: true } // Return the updated document
    );

    if (!updatedCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    res.json({ success: true, updatedCase });
  } catch (error) {
    console.error('Error updating progress level:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/api/progress-levels', async (req, res) => {
  try {
    const progressLevels = await CaseModel.find().select('_id progressLevel');
    const progressLevelsMap = {};

    progressLevels.forEach((caseItem) => {
      progressLevelsMap[caseItem._id] = caseItem.progressLevel;
    });

    res.json(progressLevelsMap);
  } catch (error) {
    console.error('Error fetching progress levels:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/api/progress-level', async (req, res) => {
  try {
    const { cnrNumber } = req.query;

    // Assuming "Case" is your Mongoose model
    const caseData = await CaseModel.findOne({ cnrNumber });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json({ progressLevel: caseData.progressLevel });
  } catch (error) {
    console.error('Error fetching progress level:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/cases', async (req, res) => {
  const { district, cnrNumber, count } = req.query;
  const { sortBy = 'filingDate', sortOrder = 'asc' } = req.query;

  // Construct the sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  try {
    // Construct the query based on available parameters
    const query = {};
    if (district) {
      query.district = district;
    }
    if (cnrNumber) {
      query.cnrNumber = cnrNumber;
    }
    if (count) {
      query.count = count;
    }

    // Fetch all cases for the specified district
    let cases = await CaseModel.find(query);

    // Separate cases by type: criminal, civil, and family
    const criminalCases = cases.filter(caseItem => caseItem.caseType === 'criminal');
    const civilCases = cases.filter(caseItem => caseItem.caseType === 'civil');
    const familyCases = cases.filter(caseItem => caseItem.caseType === 'family');

    // Sort criminal cases by filing date (oldest to newest)
    criminalCases.sort((a, b) => new Date(a.filingDate) - new Date(b.filingDate));
    // Sort civil cases by filing date (oldest to newest)
    civilCases.sort((a, b) => new Date(a.filingDate) - new Date(b.filingDate));
    // Sort family cases by filing date (oldest to newest)
    familyCases.sort((a, b) => new Date(a.filingDate) - new Date(b.filingDate));

    // Concatenate criminal, civil, and family cases
    cases = [...criminalCases, ...civilCases, ...familyCases];

    // Map the cases to include only the necessary fields
    const formattedCases = cases.map(({ _id, subject, caseType, filingDate, plaintiffName, defendantName, cnrNumber, count }) => ({
      _id,
      subject,
      caseType,
      filingDate,
      plaintiffName,
      defendantName,
      cnrNumber,
      count
    }));

    res.json(formattedCases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
``

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

app.post('/api/forgotpassword', async (req, res) => {
  const { username, email, userType } = req.body;

  try {
    let user;

    // Check user type and find the user in the corresponding collection
    if (userType === 'client') {
      user = await User.findOne({ username, email });
    } else if (userType === 'registrar') {
      user = await Registrar.findOne({ username, email });
    } else if (userType === 'advocate') {
      user = await Advocate.findOne({ username, email });
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate OTPs
    const emailOTP = generateOTP();

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
  } catch (error) {
    console.error('Error saving email OTP to the database:', error);
    return res.status(500).json({ error: 'Error saving email OTP' });
  }

});

app.post('/api/update-password', async (req, res) => {
  const { username, userType, newPassword } = req.body;

  try {
    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    let updatedUser;

    // Update the user's password based on username and usertype
    switch (userType) {
      case 'client':
        updatedUser = await User.findOneAndUpdate(
          { username },
          { $set: { password: hashedPassword } },
          { new: true }
        );
        break;

      case 'advocate':
        updatedUser = await Advocate.findOneAndUpdate(
          { username },
          { $set: { password: hashedPassword } },
          { new: true }
        );
        break;

      case 'registrar':
        updatedUser = await Registrar.findOneAndUpdate(
          { username },
          { $set: { password: hashedPassword } },
          { new: true }
        );
        break;

      default:
        return res.status(400).json({ success: false, message: 'Invalid usertype' });
    }

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
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

const generateCNR = () => {
  const digits = '0123456789';
  let cnr = '';

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    cnr += digits[randomIndex];
  }

  return cnr;
};

app.post('/api/generate-cnr', async (req, res) => {
  const { caseId } = req.body;

  try {
    // Fetch case details
    const caseDetails = await CaseModel.findById(caseId);
    console.log(caseDetails);
    if (!caseDetails) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    // Check if the count is 2, return an error
    if (caseDetails.count === 2) {
      return res
        .status(400)
        .json({ success: false, error: 'CNR number already assigned to this case' });
    }

    // If count is 1, replace the existing CNR number
    const cnrNumber = generateCNR();
    console.log(`Replaced CNR for case ${caseId}: ${cnrNumber}`);
    await CaseModel.findByIdAndUpdate(caseId, { cnrNumber, count: 2 });

    const plaintiffDetails = await User.findOne({ username: caseDetails.plaintiffName });
    console.log(plaintiffDetails.email);
    if (!plaintiffDetails) {
      console.error(`Plaintiff not found for case ${caseId}. Plaintiff name: ${caseDetails.plaintiffName}`);
      return res.status(404).json({ success: false, error: 'Plaintiff not found' });
    }

    // Fetch advocate details for plaintiff by name
    const plaintiffAdvocateDetails = await Advocate.findOne({ username: caseDetails.plaintiffAdvocate });
    console.log(plaintiffAdvocateDetails.email);
    if (!plaintiffAdvocateDetails) {
      return res.status(404).json({ success: false, error: 'Plaintiff Advocate not found' });
    }

    // Fetch defendant details by name
    const defendantDetails = await User.findOne({ username: caseDetails.defendantName });
    console.log(defendantDetails.email);
    if (!defendantDetails) {
      return res.status(404).json({ success: false, error: 'Defendant not found' });
    }

    // Generate an 8-digit CNR


    // Update the case in the database with the generated CNR
    await CaseModel.findByIdAndUpdate(caseId, { cnrNumber });

    // Send emails to plaintiff, defendant, and plaintiff's advocate
    // Send emails to plaintiff, defendant, and plaintiff's advocate
    if (plaintiffDetails && plaintiffDetails.email) {
      await sendEmail(plaintiffDetails.email, 'CNR Assigned', `Your case CNR is: ${cnrNumber}`);
    } else {
      console.error('Plaintiff email not found');
    }

    if (defendantDetails && defendantDetails.email) {
      await sendEmail(defendantDetails.email, 'CNR Assigned', `Your case CNR is: ${cnrNumber}`);
    } else {
      console.error('Defendant email not found');
    }

    if (plaintiffAdvocateDetails && plaintiffAdvocateDetails.email) {
      await sendEmail(plaintiffAdvocateDetails.email, 'CNR Assigned', `The case CNR is: ${cnrNumber}`);
    } else {
      console.error('Plaintiff Advocate email not found');
    }


    res.json({ success: true, cnrNumber });
  } catch (error) {
    console.error('Error generating CNR and sending emails:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



// Function to send emails
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'm78595322@gmail.com', // Replace with your Gmail email address
      pass: 'ycwc xxpx oqre wtun', // Replace with your Gmail email password
    },
  });

  const qmailOptions = {
    from: 'm78595322@gmail.com',
    to,
    subject,
    text,
  };

  return transporter.sendMail(qmailOptions);
};


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// ... (previous imports and setup)

const File = mongoose.model('File', {
  filename: String,
  originalname: String,
  password: String, // Add password field to the model
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const { filename, originalname } = req.file;
  const { password } = req.body; // Change to retrieve password instead of username

  const newFile = new File({ filename, originalname, password }); // Update to include password
  await newFile.save();

  res.json({ success: true });
});

app.get('/files', async (req, res) => {
  try {
    const { password } = req.query; // Retrieve the password from query parameters

    let files;

    if (password) {
      // If a password is provided, filter files by password
      files = await File.find({ password });
    } else {
      // If no password is provided, fetch all files
      files = await File.find();
    }

    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/files/:fileId', async (req, res) => {
  const fileId = req.params.fileId;

  try {
    // Fetch the file details from your database based on fileId
    const fileDetails = await File.findById(fileId);

    if (!fileDetails) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    const { filename } = fileDetails;

    // Delete the file from the uploads directory
    const filePath = path.join(__dirname, 'uploads', filename);
    await fs.unlink(filePath);

    // Implement logic to delete the file details from your database
    await File.findByIdAndDelete(fileId);

    res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ success: false, message: 'Error deleting file' });
  }
});

const clientSchema = new mongoose.Schema({
  advocateUsername: String,
  clientUsername: String,
  clientEmail: String,
  caseOverview: String,
  caseType:String,
  accepted: {
    type: Boolean,
    default: false,
  },
});

// Create a model for the clientslist collection
const Client = mongoose.model('Client', clientSchema);

// API endpoint to save client details
app.post('/api/clientslist', async (req, res) => {
  try {
    const { advocateUsername, clientUsername, clientEmail, caseOverview, caseType } = req.body;

    // Create a new client instance
    const newClient = new Client({
      advocateUsername,
      clientUsername,
      clientEmail,
      caseOverview,
      caseType,
    });

    // Save the client to the database
    await newClient.save();

    res.json({ success: true, message: 'Client details saved successfully.' });
  } catch (error) {
    console.error('Error saving client details:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

app.post('/api/validate-advocate', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the advocate by username
    const advocate = await Advocate.findOne({ username });

    if (advocate) {
      // Compare the hashed password
      const isPasswordValid = await bcrypt.compare(password, advocate.password);

      if (isPasswordValid) {
        res.json({ success: true, message: 'Credentials are valid.' });
      } else {
        res.json({ success: false, message: 'Invalid credentials.' });
      }
    } else {
      res.json({ success: false, message: 'Advocate not found.' });
    }
  } catch (error) {
    console.error('Error validating advocate credentials:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

const declinedCaseSchema = new mongoose.Schema({
  advocateUsername: String,
  clientUsername: String,
});
const DeclinedCase = mongoose.model('DeclinedCase', declinedCaseSchema);


app.get('/api/client-details/:username', async (req, res) => {
  try {
    const advocateUsername = req.params.username;

    // Find a client that is not accepted and not declined by the advocate
    const client = await Client.findOne({
      advocateUsername,
      accepted: { $ne: true },
      clientUsername: { $nin: await getDeclinedClients(advocateUsername) },
    });

    if (client) {
      const { clientUsername, caseOverview, clientEmail,caseType } = client;
      res.json({ success: true, client: { clientUsername, caseOverview, clientEmail, caseType } });
    } else {
      res.json({ success: false, message: 'No client details found.' });
    }
  } catch (error) {
    console.error('Error fetching client details:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

async function getDeclinedClients(advocateUsername) {
  const declinedCases = await DeclinedCase.find({ advocateUsername });
  return declinedCases.map((client) => client.clientUsername);
}

// Add a new route to mark the case as accepted
app.post('/api/mark-case-accepted/:username', async (req, res) => {
  try {
    const advocateUsername = req.params.username;

    // Find and update the case to mark it as accepted
    const updateResult = await Client.updateOne(
      { advocateUsername, accepted: { $ne: true } },
      { $set: { accepted: true } }
    );

    console.log('Update Result:', updateResult);

    if (updateResult.nModified > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Case already marked as accepted or not found.' });
    }
  } catch (error) {
    console.error('Error marking case as accepted:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

app.post('/api/accepted', async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    // Create a nodemailer transporter (replace with your email service details)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'm78595322@gmail.com', // Replace with your Gmail email address
        pass: 'ycwc xxpx oqre wtun', // Replace with your Gmail email password
      },
    });

    const mailOptions = {
      from: 'm78595322@gmail.com',
      to,
      subject,
      text,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});
app.post('/api/declined', async (req, res) => {
  try {
    const { advocateUsername, clientUsername, to, subject, text } = req.body;

    const declinedCase = new DeclinedCase({
      advocateUsername,
      clientUsername,
    });

    const saveResult = await declinedCase.save();

    console.log('Declined Case Saved:', saveResult);

    // Create a nodemailer transporter (replace with your email service details)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'm78595322@gmail.com', // Replace with your Gmail email address
        pass: 'ycwc xxpx oqre wtun', // Replace with your Gmail email password
      },
    });

    const mailOptions = {
      from: 'm78595322@gmail.com',
      to,
      subject,
      text,
    };
    
    await transporter.sendMail(mailOptions);



    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

app.get('/api/cases/:advocateUsername', async (req, res) => {
  try {
    const { advocateUsername } = req.params;

    // Check if the advocate is in the accepted state
    const advocate = await Client.findOne({ advocateUsername, accepted: true });

    if (!advocate) {
      return res.status(404).json({ error: 'Advocate not found or not in accepted state' });
    }

    // If the advocate is in the accepted state, fetch all cases for the advocate
    const casesData = await CaseModel.find({ plaintiffAdvocate: advocateUsername });

    if (casesData.length === 0) {
      return res.status(404).json({ error: 'No cases found for the advocate' });
    }

    res.json(casesData);
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/removePlaintiffAdvocate/:cnrNumber', async (req, res) => {
  try {
    const { cnrNumber } = req.params;

    // Find the case by CNR number and update the plaintiffAdvocate field to an empty string
    const updatedCase = await CaseModel.findOneAndUpdate(
      { cnrNumber },
      { $set: { plaintiffAdvocate: '' } },
      { new: true } // Return the updated document
    );

    if (!updatedCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json(updatedCase);
  } catch (error) {
    console.error('Error removing plaintiff advocate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/issuing-dates', async (req, res) => {
  try {
    const { cnrNumber, day, date, time } = req.body;

    // Check if the CNR number has already been issued
    const existingCase = await CaseModel.findOne({ cnrNumber });

    if (existingCase && existingCase.issuingDay && existingCase.issuingDate && existingCase.issuingTime) {
      // If already issued, return a conflict status (HTTP 409)
      return res.status(409).json({ error: 'CNR number already issued' });
    }

    // Update the CaseModel with issuing dates
    const updatedCase = await CaseModel.findOneAndUpdate(
      { cnrNumber },
      { issuedDay: day, issuedDate: date, issuedTime: time },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Send emails to advocate, plaintiff, and defendant
    const advocateData = await Advocate.findOne({ username: updatedCase.plaintiffAdvocate });
    const plaintiffData = await User.findOne({ username: updatedCase.plaintiffName });
    const defendantData = await User.findOne({ username: updatedCase.defendantName });

    // Use the correct function name `sendEmail` instead of `rsendEmail`
    sendEmail(advocateData.email, 'Dates Assigned:', `Your case has been assigned trial dates. Case number: ${cnrNumber}. Dates issued: ${date} at ${time}.`);
    sendEmail(plaintiffData.email, 'Dates Assigned:', `Your case has been assigned trial dates. Case number: ${cnrNumber}. Dates issued: ${date} at ${time}.`);
    sendEmail(defendantData.email, 'Dates Assigned:', `Your case has been assigned trial dates. Case number: ${cnrNumber}. Dates issued: ${date} at ${time}.`);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating issuing dates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/cases/:advocateUsername', async (req, res) => {
  const { advocateUsername } = req.params;

  try {
    const advocateCases = await CaseModel.find({ plaintiffAdvocate: advocateUsername });
    res.json(advocateCases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to remove plaintiffAdvocate from a case
app.post('/api/removePlaintiffAdvocate/:caseId', async (req, res) => {
  const { caseId } = req.params;

  try {
    const updatedCase = await CaseModel.findByIdAndUpdate(
      caseId,
      { $set: { plaintiffAdvocate: '' } },
      { new: true }
    );

    if (updatedCase) {
      res.status(200).json({ message: 'PlaintiffAdvocate removed successfully' });
    } else {
      res.status(404).json({ message: 'Case not found' });
    }
  } catch (error) {
    console.error('Error removing plaintiff advocate:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/api/login4', async (req, res) => {
  const { username, password } = req.body;

  try {
    const advocate = await Advocate.findOne({ username });

    if (advocate && (await bcrypt.compare(password, advocate.password))) {
      res.json({ success: true, username: advocate.username });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Route to handle fetching case details based on CNR number
app.post('/fetch-case-details', async (req, res) => {
  const { cnrNumber } = req.body;

  try {
    // Fetch case details from database based on CNR number
    const caseDetails = await CaseModel.findOne({ cnrNumber }).exec();

    // Extract relevant details
    const { plaintiffName, defendantName, plaintiffAdvocate } = caseDetails;
    
    // Return the details
    res.json({ plaintiffName, defendantName, plaintiffAdvocate });
  } catch (error) {
    console.error('Error fetching case details:', error);
    res.status(500).json({ error: 'Error fetching case details' });
  }
});

// Route to fetch user email based on name
app.get('/fetch-user-email/:name', async (req, res) => {
  const { name } = req.params;

  try {
    // Fetch user email from database based on name
    const user = await User.findOne({ username: name }).exec();

    // Return the email
    res.json({ email: user.email });
  } catch (error) {
    console.error('Error fetching user email:', error);
    res.status(500).json({ error: 'Error fetching user email' });
  }
});

// Route to fetch advocate email based on name
app.get('/fetch-advocate-email/:name', async (req, res) => {
  const { name } = req.params;

  try {
    // Fetch advocate email from database based on name
    const advocate = await Advocate.findOne({ username: name }).exec();

    // Return the email
    res.json({ email: advocate.email });
  } catch (error) {
    console.error('Error fetching advocate email:', error);
    res.status(500).json({ error: 'Error fetching advocate email' });
  }
});

// Assuming you have already imported necessary modules (express, mongoose, etc.)

// Search for completed and dismissal cases in the specified district
app.get('/api/completed-dismissal-cases', async (req, res) => {
  const { district } = req.query;
  const initialCount = 3; // Initial count value

  try {
    // Search for cases with the specified district and progress levels indicating completion or dismissal
    const completedCases = await CaseModel.countDocuments({ district, progressLevel: 'completed' });
    const dismissalCases = await CaseModel.countDocuments({ district, progressLevel: 'dismissal' });

    // Increment counts by the initial value
    const incrementedCompletedCount = completedCases + initialCount;
    const incrementedDismissalCount = dismissalCases + initialCount;

    // Send the counts as a response
    res.json({ completedCount: incrementedCompletedCount, dismissalCount: incrementedDismissalCount });
  } catch (error) {
    console.error('Error fetching completed and dismissal cases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/case-details', async (req, res) => {
  const { cnrNumber } = req.query;

  try {
    // Search for the case with the specified CNR number
    const caseData = await CaseModel.findOne({ cnrNumber });

    if (caseData) {
      // Check the progress level of the case
      if (caseData.progressLevel === 'dismissal' || caseData.progressLevel === 'completed') {
        // If case is dismissal or completed, send the details as a response
        res.json(caseData);
      } else {
        // If case is not dismissal or completed, send a 404 response
        res.status(404).json({ error: 'Case not found' });
      }
    } else {
      // If case is not found, send a 404 response
      res.status(404).json({ error: 'Case not found' });
    }
  } catch (error) {
    console.error('Error fetching case details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/update-case-details/:cnrNumber', async (req, res) => {
  const { cnrNumber } = req.params;
  const { judge, decision, decisionDate } = req.body;

  try {
    // Find the case with the specified CNR number and update its details
    const updatedCase = await CaseModel.findOneAndUpdate(
      { cnrNumber },
      { judge, decision, decisionDate },
      { new: true } // Return the updated document
    );

    if (updatedCase) {
      // If case is found and updated successfully, send the updated details as a response
      res.json(updatedCase);
    } else {
      // If case is not found, send a 404 response
      res.status(404).json({ error: 'Case not found' });
    }
  } catch (error) {
    console.error('Error updating case details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});