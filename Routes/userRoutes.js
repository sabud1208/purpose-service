//importing modules
const express = require('express')
const userController = require('../Controllers/userController')
const { signup, login, authenticateToken, getAllUsers, getUser, getAgePreference } = userController
const userAuth = require('../Middlewares/userAuth')
const app = express();
const router = express.Router()


router.post('/signup', userAuth.saveUser, signup)

//login route
router.post('/login', login )

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

router.get('/getUser', getUser)

router.post('/agePreference', getAgePreference)

module.exports = router