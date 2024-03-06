const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
var https = require("https");
const fs = require("fs");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "/frontend/build")));

var corsOptions = {
  origin: "https://marketplace.chatafisha.com",
  methods: ["GET", "POST", "PUT"], // Allow only GET and POST requests
};

app.use(cors(corsOptions));
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

  const { createServer } = require("http");
  const httpServer = createServer(app);
  httpServer.listen(port, process.env.ALWAYSDATA_HTTP_ID, () => {
    console.log(`App is running at ${port}`);
  });

