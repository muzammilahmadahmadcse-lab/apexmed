import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    if (!slotDate) return ''
    const dateArray = slotDate.split('_')
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token }
      })

      if (data.success) {
        setAppointments(data.appointments.reverse())
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()

        if (getDoctorsData) getDoctorsData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }


  const handleMockPayment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-mock`,
        { appointmentId },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }




  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  useEffect(() => {
    if (!token) return
    getUserAppointments()
    const id = setInterval(getUserAppointments, 10000)
    return () => clearInterval(id)
  }, [token])


  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b border-zinc-200'>
        My appointments
      </p>

      <div>
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b border-zinc-200'
              key={item._id || index}
            >
              {/* Doctor Image */}
              <div>
                <img
                  className='w-32 bg-indigo-50 rounded-lg object-cover'
                  src={item.docData?.image}
                  alt={item.docData?.name || 'Doctor'}
                />
              </div>

              {/* Doctor & Appointment Details */}
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold text-base'>{item.docData?.name}</p>
                <p className='text-zinc-500 mt-0.5'>{item.docData?.speciality}</p>

                <p className='text-zinc-700 font-medium mt-3'>Address:</p>
                <p className='text-xs text-zinc-500 mt-1'>{item.docData?.address?.line1}</p>
                <p className='text-xs text-zinc-500'>{item.docData?.address?.line2}</p>

                <p className='text-xs mt-3'>
                  <span className='text-sm font-medium text-neutral-700'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col gap-2 justify-end text-sm text-center'>

                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button onClick={() => handleMockPayment(item._id)} className='text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer'>
                    Pay
                  </button>
                )}

                {/* payment */}
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50 font-medium cursor-default'>
                    Paid
                  </button>
                )}




                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className='text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer'
                  >
                    Cancel appointment
                  </button>
                )}

                {item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500 cursor-default'>
                    Completed
                  </button>
                )}

                {item.cancelled && (
                  <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 cursor-default'>
                    Appointment cancelled
                  </button>
                )}

                {item.isAccepted && !item.cancelled && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border border-blue-500 rounded text-blue-500 cursor-default'>
                    Accepted by doctor
                  </button>
                )}




              </div>
            </div>
          ))
        ) : (
          <p className='py-6 text-zinc-500'>No appointments booked yet.</p>
        )}
      </div>
    </div>
  )
}

export default MyAppointments