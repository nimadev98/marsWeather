const mongoose = require("mongoose");
const { v4 } = require("uuid");
const userSchema = new mongoose.Schema({
  count: Number,
  apiKey: String,
  email: String,
  phone: Number,
  hash: String,
  salt: String,
});
const personSchema = new mongoose.Schema({
  ip: String,
  count: Number,
});

const User = new mongoose.model("User", userSchema);
const Person = new mongoose.model("Person", personSchema);

async function getUser(ip) {
  const user = await User.findOne({ ip: ip });
  return user;
}
async function getUserByEmail(email) {
  const user = await User.findOne({ email: email });
  return user;
}
async function registerUser(email, hash, salt, phone) {
  const newUser = new User({
    email: email,
    hash: hash,
    salt: salt,
    phone: phone,
    count: 0,
    apiKey: v4(),
  });
  await newUser.save();
}

async function getPerson(ip) {
  const person = await Person.findOne({ ip: ip });
  return person;
}
async function addPerson(ip) {
  const newPerson = new Person({
    ip: ip,
    count: 0,
  });
  await newPerson.save();
}
async function plusP(ip) {
  const person = await getPerson(ip);
  const count = person.count;
  await Person.updateOne({ ip: ip }, { count: count + 1 });
}

async function plusU(token) {
  const user = await User.findOne({ apiKey: token });
  console.log(user);
  const count = user.count;
  await User.updateOne({ apiKey: token }, { count: count + 1 });
}

async function getToken(token = {}) {
  return await User.find(token);
}

async function resetAll() {
  await User.updateMany({}, { count: 0 });
  await Person.updateMany({}, { count: 0 });
}

module.exports = {
  getUser,
  getPerson,
  addPerson,
  plusP,
  getUserByEmail,
  registerUser,
  getToken,
  plusU,
  resetAll,
};
