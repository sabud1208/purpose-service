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

const getAgePreference = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({
      attributes: ['id', 'userName', 'email', 'age', 'minAge', 'maxAge'],
      where: {
        email: email,
      },
    });

    if (user) {
      const { minAge, maxAge } = user;

      // Find all users with age within the specified range
      const usersWithSameAgePreferences = await User.findAll({
        attributes: ['id', 'userName', 'email', 'age', 'minAge', 'maxAge'],
        where: {
          age: {
            [Op.between]: [minAge, maxAge],
          },
        },
      });

      return res.status(200).send(usersWithSameAgePreferences);
    } else {
      return res.status(404).send({ error: 'User not found' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

const getUser = async (res) => { 
  
  console.log(User);
}
const signup = async (req, res) => {
 try {
   const { userName, email, password, age, minAge, maxAge, images } = req.body;
   const data = {
     userName,
     email,
     password: await bcrypt.hash(password, 10),
     age,
     minAge,
     maxAge,
     images
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
    const isSame = await bcrypt.compare(password, user.password);
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


const updateUserAgePreferences = async (req, res) => {
  try {
    const { email, minAge, maxAge } = req.body;

    // Validate that email, minAge, and maxAge are provided
    if (!email || !minAge || !maxAge) {
      return res.status(400).send({ error: 'email, minAge, and maxAge are required' });
    }

    // Update user's minAge and maxAge in the database based on email
    const [updatedRowsCount, updatedRows] = await User.update(
      { minAge, maxAge },
      {
        where: {
          email: email,
        },
        returning: true, // Get the updated rows in the result
      }
    );

    // Check if the user was found and updated
    if (updatedRowsCount === 1) {
      return res.status(200).send({ message: 'User age preferences updated successfully', user: updatedRows[0] });
    } else {
      return res.status(404).send({ error: 'User not found' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};


module.exports = {
  updateUserAgePreferences,
  getAgePreference,
  getUser,
  getAllUsers,
  signup,
  login,
  authenticateToken,
};
