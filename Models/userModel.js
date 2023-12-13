module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define( "user", {
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true, 
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        minAge:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maxAge:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {timestamps: true}, )
    return User
 }