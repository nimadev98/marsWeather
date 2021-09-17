require("dotenv").config();
const axios = require("axios");

async function getData() {
  const response = await axios.get(
    `https://api.nasa.gov/insight_weather/?api_key=${process.env.API_KEY}&feedtype=json&ver=1.0`
  );
  return response.data;
}

module.exports = {
  getData,
};
