// import express from "express";
// import { registerPatient, getAllPatients, login } from "../controller/patient.controller.js";

// const router = express.Router();

// router.get("/", (req, res) => {
//     res.status(200).json({status: "ok"})
// });

// router.post('/signup', registerPatient);
// router.get('/all', getAllPatients);
// router.post('/login', login);


// export default router;

import express from "express";
import { registerPatient, login, getProfile } from "../controller/patient.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", (req, res) => res.status(200).json({ status: "ok" }));

router.post("/signup", registerPatient);
router.post("/login", login);

// ✅ Protected route
router.get("/me", protect, getProfile);

export default router;
