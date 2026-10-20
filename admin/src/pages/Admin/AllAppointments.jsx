import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

 
  const getAge = (dob) => {
    if (calculateAge) return calculateAge(dob)
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  useEffect(() => {
  if (!aToken) return
  getAllAppointments()
  const id = setInterval(getAllAppointments, 10000)
  return () => clearInterval(id)
}, [aToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
          {/* Table Handler */}
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b bg-gray-50 text-gray-600 font-semibold'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

       
        {appointments && appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              key={item._id || index}
              className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 transition-all'
            >
              <p className='max-sm:hidden'>{index + 1}</p>

              {/* Patient Info */}
              <div className='flex items-center gap-2'>
                <img
                  className='w-8 h-8 rounded-full object-cover'
                  src={item.userData?.image || assets.default_user}
                  alt='Patient'
                />
                <p className='font-medium text-gray-800'>{item.userData?.name || 'N/A'}</p>
              </div>

              {/* Patient Age */}
              <p className='max-sm:hidden'>
               
                {item.userData?.dob ? getAge(item.userData.dob) : 'N/A'}
              </p>

              {/* Slot Date & Time */}
              <p>
                {slotDateFormat ? slotDateFormat(item.slotDate) : item.slotDate}, {item.slotTime}
              </p>

              {/* Doctor Info */}
              <div className='flex items-center gap-2'>
                <img
                  className='w-8 h-8 rounded-full bg-gray-200 object-cover'
                  src={item.docData?.image || assets.default_doctor}
                  alt='Doctor'
                />
                <p className='font-medium text-gray-800'>{item.docData?.name || 'N/A'}</p>
              </div>

              {/* Fees */}
              <p>
                {currency || '$'}
                {item.amount}
              </p>

              {/*  Action Button */}
              <div>
                {item.cancelled ? (
                  <span className='text-red-400 text-xs font-medium'>Cancelled</span>
                ) : item.isCompleted ? (
                  <span className='text-green-500 text-xs font-medium'>Completed</span>
                ) : (
                  <img
                    onClick={() => cancelAppointment && cancelAppointment(item._id)}
                    className='w-10 cursor-pointer hover:opacity-75 transition-opacity'
                    src={assets.cancel_icon}
                    alt='Cancel Appointment'
                    title='Cancel Appointment'
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className='flex items-center justify-center h-64 text-gray-400'>
            No appointments found.
          </div>
        )}
      </div>
    </div>
  )
}

export default AllAppointments