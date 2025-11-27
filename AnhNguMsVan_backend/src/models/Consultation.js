import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["new", "contacted", "closed"],
            default: "new",
        },
    },
    { timestamps: true, }
);

const Consultation = mongoose.model("Consultation", consultationSchema);

export default Consultation;