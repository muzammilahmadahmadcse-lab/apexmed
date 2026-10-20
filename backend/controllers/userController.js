import doctorModel from '../models/doctorModel.js'
import userModel from '../models/userModel.js'
import appointmentModel from '../models/appointmentModel.js'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import notificationModel from '../models/notificationModel.js'
// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing Details' })
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Enter a valid email' })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'Enter a strong password' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = { name, email, password: hashedPassword }
    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.json({ success: true, token })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid credentials' })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body
    const userData = await userModel.findById(userId).select('-password')
    res.json({ success: true, userData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: 'Data Missing' })
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: typeof address === 'string' ? JSON.parse(address) : address,
      dob,
      gender
    })

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      const imageUrl = imageUpload.secure_url

      await userModel.findByIdAndUpdate(userId, { image: imageUrl })
    }

    res.json({ success: true, message: 'Profile Updated' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body

    const docData = await doctorModel.findById(docId).select('-password')

    if (!docData) {
      return res.json({ success: false, message: 'Doctor not found' })
    }

    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor is currently not available' })
    }

    let slots_booked = docData.slots_booked || docData.slots_book || {}

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot not available' })
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')

    if (!userData) {
      return res.json({ success: false, message: 'User not found' })
    }

    const docDataCopy = docData.toObject()
    delete docDataCopy.slots_booked
    delete docDataCopy.slots_book

    const appointmentData = {
      userId,
      docId,
      userData,
      docData: docDataCopy,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    await doctorModel.findByIdAndUpdate(docId, { 
      slots_booked,
      slots_book: slots_booked 
    })

    res.json({ success: true, message: 'Appointment Booked Successfully' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to get user appointment for frontend my-appointment page 
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body
    const appointments = await appointmentModel.find({ userId })

    res.json({ success: true, appointments })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

  
    if (!appointmentData || appointmentData.userId !== userId) {
      return res.json({ success: false, message: 'Unauthorized action or appointment not found' })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

  
    const { docId, slotDate, slotTime } = appointmentData
    const doctorData = await doctorModel.findById(docId)

   
    let slots_booked = doctorData.slots_booked || doctorData.slots_book || {}

    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
    }

   
    await doctorModel.findByIdAndUpdate(docId, { 
      slots_booked,
      slots_book: slots_booked 
    })

    res.json({ success: true, message: 'Appointment Cancelled' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to process simulated payment
const paymentMock = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData || appointmentData.userId !== userId) {
      return res.json({ success: false, message: 'Unauthorized action or appointment not found' })
    }

    if (appointmentData.cancelled) {
      return res.json({ success: false, message: 'Cannot pay for cancelled appointment' })
    }

   
    await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })

    res.json({ success: true, message: 'Payment Successful ' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Notification option


const getNotifications = async (req, res) => {
  try {
    const { userId } = req.body
    const notifications = await notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json({ success: true, notifications })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

const markNotificationsRead = async (req, res) => {
  try {
    const { userId } = req.body
    await notificationModel.updateMany({ userId, read: false }, { read: true })
    res.json({ success: true })
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}


export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentMock,
  getNotifications,
  markNotificationsRead

}

