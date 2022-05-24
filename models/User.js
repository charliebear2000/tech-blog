const bcrypt = require('bcrypt');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class User extends Model {
   // set up method to run on instance data (per user) to check password
   checkPassword(loginPw) {
      return bcrypt.compareSync(loginPw, this.password);
   }
}

// define table columns and configuration
User.init(
  {
   // define an id column
   id: {
      
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
   },
   // define a username column
   username: {
      type: DataTypes.STRING,
      allowNull: false
   },
   // define an email column
   email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
         isEmail: true
      }
   },
   // define a password column
   password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         len: [4]
      }
   }
  },
  {
    
    hooks: {
      async beforeCreate(newUserData) {
         newUserData.password = await bcrypt.hash(newUserData.password, 10);
         return newUserData;
          
      },
      async beforeUpdate(updateUserData) {
         updateUserData.password = await bcrypt.hash(updateUserData.password, 10);
         return updateUserData;
       }
    },
   
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user'
  }
);

module.exports = User;