
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors')

const app = express();
const PORT = 5000;
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/User_authentication', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
})
const User = mongoose.model('User', UserSchema);

app.use(bodyParser.json());

app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res.status(409).json({ success: false, message: 'Username already exists' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser=new User({ username:username, password: hashedPassword })
      await User.create(newUser);
      console.log('success');
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
