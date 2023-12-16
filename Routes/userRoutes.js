//importing modules
const express = require('express')
const userController = require('../Controllers/userController')
const { signup, login, authenticateToken, getAllUsers, getUser, getAgePreference, updateUserAgePreferences } = userController
const userAuth = require('../Middlewares/userAuth')
const app = express();
const router = express.Router()


router.post('/signup', userAuth.saveUser, signup)

//login route
router.post('/login', login )

router.post('/updateAgePreference', updateUserAgePreferences)
//auth route
router.get('/auth', authenticateToken)

router.get('/getAllUsers', async (req, res) => {
    try {
      const users = await getAllUsers().then((users)=>{
        if(users){
            return res.send(users)
           }
      });
      
    } catch (error) {
      console.log(error)
    };
})

router.get('/getId', async (req, res) =>{
  try {
    if (req.isAuthenticated()) {
      const currentUserId = req.user.id;
      res.send(`Current user ID: ${currentUserId}`);
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
router.get('/getUser', getUser)

router.post('/agePreference', getAgePreference)

module.exports = router