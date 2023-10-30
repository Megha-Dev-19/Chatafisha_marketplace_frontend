const router = require("express").Router();
let Nft = require("../models/nft.model");
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../src/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

router.route("/").get((req, res) => {
  Nft.find()
    .then((nfts) => res.json(nfts))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const {
      code,
      name,
      email,
      accountid,
      description,
      typeofwaste,
      kgs,
      date,
      status,
    } = req.body;
    const imagePath = req.file.filename; // Multer adds "path" property to req.file

    // Create a new Nft instance with the uploaded image path
    const newNft = new Nft({
      code,
      image: imagePath, // Save the image path
      name,
      email,
      accountid,
      description,
      typeofwaste,
      kgs,
      date,
      status,
    });

    // Save the NFT data to the database
    await newNft.save();

    res.status(201).json({ message: "NFT created successfully", data: newNft });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const ObjectId = mongoose.Types.ObjectId;

router.delete("/delete/:code", async (req, res) => {
  try {
    const { code } = req.params;

    // Find the document by 'code' field and delete it
    const deletedNft = await Nft.findOneAndDelete({ code: code });
    try {
      fs.unlinkSync(`../src/images/${deletedNft.image}`);
    } catch (err) {
      console.log(err);
    }
    // Check if entity exists
    if (!deletedNft) {
      return res.status(404).json({ message: "Nft claim not found" });
    }

    // Rest of your code...
    res.json({ message: "Nft claim deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/find/:code", async (req, res) => {
  try {
    const { code } = req.params;

    // Find the document by 'code' field
    const nft = await Nft.findOne({ code: code });

    // Check if entity exists
    if (!nft) {
      return res.status(404).json({ message: "Nft claim not found" });
    }

    res.json(nft); // Send the found document as the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.put("/update-status/:code", async (req, res) => {
  try {
    const { code } = req.params;

    // Find the document by 'code' field and update the 'status' field
    const updatedNft = await Nft.findOneAndUpdate(
      { code: code },
      { $set: { status: "minted" } },
      { new: true } // Return the updated document after the update operation
    );

    // Check if entity exists
    if (!updatedNft) {
      return res.status(404).json({ message: "Nft claim not found" });
    }

    res.json(updatedNft); // Send the updated document as the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
