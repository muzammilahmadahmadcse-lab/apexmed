import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  appointmentId: String,
  type: { type: String, enum: ["booked", "accepted", "cancelled", "completed"], required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.notification || mongoose.model("notification", notificationSchema)