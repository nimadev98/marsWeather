require("dotenv").config();
const mongoose = require("mongoose");
async function connectDb() {
  await mongoose.connect(process.env.DB_SERVER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
module.exports = connectDb;
