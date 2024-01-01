const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 5000;
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/User_authentication', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const fileSchema = new mongoose.Schema({
  originalFilename: String, // Add this field
  filename: String,
  path: String,
});

const File = mongoose.model('File', fileSchema);

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
  password: String,
});

const User = mongoose.model('User', userSchema);


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



// for lists
const Advocate = mongoose.model('Advocate', userSchema);
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



// Update the file creation logic to store the original filename
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const newFile = new File({
    originalFilename: req.file.originalname,
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });

  try {
    await newFile.save();
    res.json({ filePath: newFile.path });
  } catch (error) {
    console.error('Error saving file to database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add this endpoint to handle GET requests for fetching documents
app.get('/files', async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
