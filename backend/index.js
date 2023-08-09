const express = require("express");
const { connection } = require("./config/db");
const { userRoute } = require("./routes/user.routes");
const { blogRoute } = require("./routes/blog.routes");
const cors = require("cors")
require("dotenv").config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors())
app.use("/user",userRoute);
app.use("/blog",blogRoute);


app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("db is connected");
  } catch (error) {
    console.log(error);
  }
  console.log("server is running");
});
