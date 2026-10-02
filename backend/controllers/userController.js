const bcrypt = require("bcryptjs");
const User = require("../models/User");

// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: "Server error while fetching users"
    });
  }
};

// CREATE USER
const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required"
      });
    }

    const allowedRoles = [
      "admin",
      "doctor",
      "staff",
      "viewer"
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      isActive: true
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error("Create user error:", error);

    res.status(500).json({
      message: "Server error while creating user"
    });
  }
};

// ACTIVATE / DEACTIVATE USER
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      message: "User status updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error("Update user status error:", error);

    res.status(500).json({
      message: "Server error while updating user"
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUserStatus
};