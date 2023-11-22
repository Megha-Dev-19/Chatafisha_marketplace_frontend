const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();
const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, "/frontend/build")));

app.use(cors());
app.use(express.json());

const uri =
  process.env.ATLAS_URI ||
  "mongodb+srv://dbUser:chatafisha123@cluster0.6pxonhv.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const nftsRouter = require("./routes/nfts");
// const usersRouter = require("./routes/users");

app.use("/nfts", nftsRouter);
// app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
