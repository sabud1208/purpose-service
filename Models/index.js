const {Sequelize, DataTypes} = require('sequelize')


const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`, `${process.env.DB_PASSWORD}`, {
    host: 'localhost',
    dialect: 'postgres'
  });

    sequelize.authenticate().then(() => {
    }).catch((err) => {
        console.log(err)
    })

    const db = {}
    db.Sequelize = Sequelize
    db.sequelize = sequelize


db.users = require('./userModel') (sequelize, DataTypes)


module.exports = db