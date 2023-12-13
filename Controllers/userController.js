const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const  express  = require("express");
const app = express();

const User = db.users;

const getAllUsers = () => {
   
  return User.findAll({ raw: true })
  .then((results) => {
    if (results) {
      console.log(results);
      return results;
    } else {
      throw new Error('No users found');
    }
  })
  .catch((error) => {
    console.error('Error fetching users:', error);
    throw error;
  });
    };

const authenticateToken = (req, res) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;

  });
};

const getAgePreference = async (req, res) =>{
  try {
    const { minAge,maxAge } = req.body;
    
       const user = await User.findAll({
        someAttribute: {
          [Op.between]: [minAge, maxAge]
         }})
         if(user){
          return res.status(201).send(user);
         }
        
}catch (error) {
  console.log(error);
}
}
const getUser = async (res) => { 
  
  if(User){
    return res.status(201)
  }else {
    return res.status(500)
  }
}
const signup = async (req, res) => {
 try {
   const { userName, email, password, age, minAge, maxAge } = req.body;
   const data = {
     userName,
     email,
     password: await bcrypt.hash(password, 10),
     age,
     minAge,
     maxAge
   };
  
   const user = await User.create(data);


   if (user) {
     let token = jwt.sign({ id: user.id }, process.env.secretKey, {
       expiresIn: 1 * 24 * 60 * 60 * 1000,
     });

     res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
     console.log("user", JSON.stringify(user, null, 2));
     console.log(token);
 
     return res.status(201).send(user);
   } else {
     return res.status(409).send("Details are not correct");
   }
 } catch (error) {
   console.log(error);
 }
};

const login = async (req, res) => {
 try {
const { email, password } = req.body;

   const user = await User.findOne({
     where: {
     email: email
   } 
     });

   if (user) {
     const doesPasswordMatch = await bcrypt.compare(password, user.password);

     if (isSame) {
       let token = jwt.sign({ id: user.id }, process.env.secretKey, {
         expiresIn: 1 * 24 * 60 * 60 * 1000,
       });

       res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
       console.log("user", JSON.stringify(user, null, 2));
       return res.status(201).send(user);
     } else {
       return res.status(401).send("Authentication failed");
     }
   } else {
     return res.status(401).send("Authentication failed");
   }
 } catch (error) {
  console.log(error);
}
};




module.exports = {
  getAgePreference,
  getUser,
  getAllUsers,
  signup,
  login,
  authenticateToken,
};
