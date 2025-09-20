// import { Patient } from "../model/Patient.js";
// import { vallidateAllBodyFields } from "../utils/vallidator.js";
// import bcrypt from "bcryptjs";

// const registerPatient = async (req, res) => {
//   try {
//     req.body = req.body || {};
//     const { firstName, lastName, email, password } = req.body;

//     // validate
//     const { status, message } = vallidateAllBodyFields(req.body, [
//       "firstName",
//       "lastName",
//       "email",
//       "password",
//     ]);

//     if (!status) {
//       return res.status(400).json({ message });
//     }

//     // check for existing user
//     const existingUser = await Patient.findOne({ email });

//     if (existingUser) {
//       return res.status(409).json({ message: "User already exists" });
//     }

//     // hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // save user
//     const newUser = new Patient({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     return res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: newUser._id,
//         firstName: newUser.firstName,
//         lastName: newUser.lastName,
//         email: newUser.email,
//       },
//     });
//   } catch (error) {
//     console.error("Error in registerPatient:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   const { status, message } = vallidateAllBodyFields(req.body, [
//     "email",
//     "password",
//   ]);

//   if (!status) {
//     return res.status(400).json({ message });
//   }

//   const patient = await Patient.findOne({ email });

//   if (!patient) {
//     res.status(400).json({ message: "Invalid email or password" });
//   }

//   const isMatch = await bcrypt.compare(password, patient.password);

//   if (!isMatch) {
//     res.status(400).json({ message: "Invalid email or password" });
//   }

//   res.status(200).json({ message: "Login successfull", patient });
// };

// const getAllPatients = async (req, res) => {
//   const patients = await Patient.find();
//   res.status(200).json(patients);
// };

// export { registerPatient, getAllPatients, login };


import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Patient } from "../model/Patient.js";
import { vallidateAllBodyFields } from "../utils/vallidator.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // put in .env

// Generate JWT
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: "1d" });
};

// REGISTER
const registerPatient = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const { status, message } = vallidateAllBodyFields(req.body, [
    "firstName",
    "lastName",
    "email",
    "password",
  ]);
  if (!status) return res.status(400).json({ message });

  try {
    const existing = await Patient.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const patient = await Patient.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(patient._id, patient.email);

    res.status(201).json({
      message: "Patient registered successfully",
      token,
      patient: {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  const { status, message } = vallidateAllBodyFields(req.body, [
    "email",
    "password",
  ]);
  if (!status) return res.status(400).json({ message });

  try {
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(patient._id, patient.email);

    res.status(200).json({
      message: "Login successful",
      token,
      patient: {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PROFILE (protected)
const getProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select("-password");
    if (!patient) return res.status(404).json({ message: "User not found" });
    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { registerPatient, login, getProfile };
