// const a=12
// if(a>10){
//     console.log("greater than 10")
// }
// else{
//     console.log("less than 10")
// }
// console.log("first node program...")

// let's keep this name local
const john="john"
// let's share this content
const ram="ram"
const sita="sita"
//console.log(module)
module.exports={ram,sita}


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





















