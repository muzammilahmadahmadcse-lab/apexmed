import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment, acceptAppointment } = useContext(DoctorContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  useEffect(() => {
  if (!dToken) return
  getAppointments()
  const id = setInterval(getAppointments, 10000)
  return () => clearInterval(id)
}, [dToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
        {/* Table Header */}
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b bg-gray-50 text-gray-600 font-semibold'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Table Body */}
        {appointments && appointments.length > 0 ? (
          appointments.reverse().map((item, index) => (
            <div
              key={item._id || index}
              className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 transition-all'
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

              {/* Payment Mode */}
              <div>
                <p className='text-xs inline border border-primary px-2 py-0.5 rounded-full text-primary font-medium'>
                  {item.payment ? 'Online' : 'CASH'}
                </p>
              </div>

              {/* Patient Age */}
              <p className='max-sm:hidden'>
                {item.userData?.dob ? (calculateAge ? calculateAge(item.userData.dob) : 'N/A') : 'N/A'}
              </p>

              {/* Slot Date & Time */}
              <p>
                {slotDateFormat ? slotDateFormat(item.slotDate) : item.slotDate}, {item.slotTime}
              </p>

              {/* Fees */}
              <p>
                {currency || '$'}
                {item.amount}
              </p>

              {/* Action Column */}
              <div>
                {item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='text-green-500 text-xs font-medium'>Completed</p>
                ) : (
                  <div className='flex items-center gap-2'>

                    {/* ADDED: Accept button (hidden once accepted) */}
                    {!item.isAccepted && (
                      <button
                        onClick={() => acceptAppointment && acceptAppointment(item._id)}
                        className='px-3 py-1 text-xs border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all cursor-pointer'
                      >
                        Accept
                      </button>
                    )}
                    {/* END ADDED */}

                    <img
                      onClick={() => cancelAppointment && cancelAppointment(item._id)}
                      className='w-10 cursor-pointer hover:opacity-75 transition-opacity'
                      src={assets.cancel_icon}
                      alt='Cancel'
                      title='Cancel Appointment'
                    />

                    {/* CHANGED: tick shows only after the doctor has accepted */}
                    {item.isAccepted && (
                      <img
                        onClick={() => completeAppointment && completeAppointment(item._id)}
                        className='w-10 cursor-pointer hover:opacity-75 transition-opacity'
                        src={assets.tick_icon}
                        alt='Complete'
                        title='Mark Completed'
                      />
                    )}
                  </div>
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

export default DoctorAppointments