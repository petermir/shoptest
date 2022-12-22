const bcrypt = require('bcryptjs');
const mongodb = require('mongodb')

const db = require('../data/database');

class User {
  constructor(email, password, fullname, street, city, country, postal) {
    this.email = email;
    this.password = password;
    this.name = fullname;
    this.address = {
      street: street,
      city: city,
      country: country,
      postalCode: postal,
    };
  }

  static findById(userId) {
    const uid = new mongodb.ObjectId(userId);
    return db
      .getDb()
      .collection("users")
      .findOne({ _id: uid }, {projection: { password: 0 } });
  }
  
  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    } else {
      return false;
    }
  }
  
  async signup() {
    const hashedPassowrd = await bcrypt.hash(this.password, 12);

    await db.getDb().collection('users').insertOne({
      email: this.email,
      password: hashedPassowrd,
      name: this.name,
      address: this.address,
    });
  }

  comparePassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
  
}

module.exports = User
