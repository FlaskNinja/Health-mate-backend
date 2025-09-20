import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        unique: false,
        required: true
    },
    lastName: {
        type: String,
        unique: false,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: false,
        required: true,
    }
});


const Patient = mongoose.model("Patient", patientSchema);

export { Patient };