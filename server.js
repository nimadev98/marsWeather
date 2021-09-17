const http = require("http");
const app = require("./app");
const connectDb = require("./connectDb");
const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

async function startApp() {
  await connectDb();

  server.listen(PORT, () => {
    console.log(`Server Running On PORT ${PORT}`);
  });
}

startApp();
