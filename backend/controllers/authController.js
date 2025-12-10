const User = require("../models/User");
const jwt = require("jsonwebtoken");

// REGISTER USER (Updated)
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, semester, branch, year } = req.body;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    // Create new user with all fields
    const newUser = new User({
      name,
      email,
      password,
      phone: phone || "",
      semester: semester || "",
      branch: branch || "",
      year: year || "",
      enrollment: `ENR${Date.now().toString().slice(-6)}` // Auto-generate enrollment
    });

    await newUser.save();

    // JWT Payload
    const payload = {
      userId: newUser._id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    // Return user data along with token
    res.json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        semester: newUser.semester,
        branch: newUser.branch,
        year: newUser.year,
        enrollment: newUser.enrollment
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration"
    });
  }
};

// LOGIN USER (Updated to return user data)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "User not found"
      });

    // Compare password (bcrypt)
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });

    // JWT
    const payload = {
      userId: user._id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    // Return user data
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        semester: user.semester || "",
        branch: user.branch || "",
        year: user.year || "",
        enrollment: user.enrollment || ""
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
};

// GET CURRENT USER PROFILE
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        semester: user.semester || "",
        branch: user.branch || "",
        year: user.year || "",
        enrollment: user.enrollment || ""
      }
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// UPDATE USER PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, semester, branch, year, enrollment } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        name,
        phone,
        semester,
        branch,
        year,
        enrollment
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};