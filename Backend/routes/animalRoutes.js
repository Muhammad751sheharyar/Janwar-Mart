const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Animal = require("../models/Animal");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// MULTER IMAGE UPLOAD SETUP
// ======================================================

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const fileName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      ext;

    cb(null, fileName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/jfif",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// ======================================================
// POST ANIMAL
// ======================================================

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        type,
        breed,
        age,
        gender,
        location,
        price,
        description,
      } = req.body;

      if (
        !name ||
        !type ||
        !breed ||
        !age ||
        !gender ||
        !location ||
        !price ||
        !description
      ) {
        return res.status(400).json({
          success: false,
          message: "All required fields are required",
        });
      }

      const animal = await Animal.create({
        name,
        type,
        breed,
        age,
        gender,
        location,
        price,
        description,

        image: req.file
          ? `/uploads/${req.file.filename}`
          : "",

        seller: req.user.userId,

        status: "Available",
      });

      res.status(201).json({
        success: true,
        message: "Animal posted successfully",
        animal,
      });
    } catch (error) {
      console.error("POST ANIMAL ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// ======================================================
// GET ALL ANIMALS
// ======================================================

router.get("/", async (req, res) => {
  try {
    const animals = await Animal.find()
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: animals.length,
      animals,
    });
  } catch (error) {
    console.error("GET ALL ANIMALS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ======================================================
// GET SINGLE ANIMAL
// ======================================================

router.get("/:id", async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id)
      .populate("seller", "name email");

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Animal not found",
      });
    }

    res.json({
      success: true,
      animal,
    });
  } catch (error) {
    console.error("GET SINGLE ANIMAL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ======================================================
// EDIT / UPDATE ANIMAL
// ======================================================

router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const animal = await Animal.findById(req.params.id);

      if (!animal) {
        return res.status(404).json({
          success: false,
          message: "Animal not found",
        });
      }

      // Sirf owner apna animal edit kar sakta hai
      if (animal.seller.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own animal",
        });
      }

      const updateData = {
        name: req.body.name,
        type: req.body.type,
        breed: req.body.breed,
        age: req.body.age,
        gender: req.body.gender,
        location: req.body.location,
        price: req.body.price,
        description: req.body.description,
      };

      // Agar new image upload hui hai
      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }

      const updatedAnimal =
        await Animal.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            returnDocument: "after",
            runValidators: true,
          }
        );

      res.json({
        success: true,
        message: "Animal updated successfully",
        animal: updatedAnimal,
      });
    } catch (error) {
      console.error("UPDATE ANIMAL ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// ======================================================
// MARK ANIMAL AS SOLD
// ======================================================

router.put(
  "/:id/sold",
  authMiddleware,
  async (req, res) => {
    try {
      const animal = await Animal.findById(req.params.id);

      if (!animal) {
        return res.status(404).json({
          success: false,
          message: "Animal not found",
        });
      }

      // Sirf owner apna animal sold kar sakta hai
      if (animal.seller.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own animal",
        });
      }

      animal.status = "Sold";

      await animal.save();

      res.json({
        success: true,
        message: "Animal marked as sold",
        animal,
      });
    } catch (error) {
      console.error("MARK SOLD ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// ======================================================
// DELETE ANIMAL
// ======================================================

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const animal = await Animal.findById(req.params.id);

      if (!animal) {
        return res.status(404).json({
          success: false,
          message: "Animal not found",
        });
      }

      // Sirf owner apna animal delete kar sakta hai
      if (animal.seller.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own animal",
        });
      }

      await Animal.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "Animal deleted successfully",
      });
    } catch (error) {
      console.error("DELETE ANIMAL ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

module.exports = router;