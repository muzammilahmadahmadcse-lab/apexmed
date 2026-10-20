import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const { currency, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (dToken && getDashData) {
      getDashData()
    }
  }, [dToken])

  useEffect(() => {
  if (!dToken) return
  getDashData()
  const id = setInterval(getDashData, 10000)
  return () => clearInterval(id)
}, [dToken])



  return (
    dashData && (
      <div className='m-5 w-full max-w-6xl'>
        {/* Metric Cards Section */}
        <div className='flex flex-wrap gap-4 mb-8'>
          {/* Earnings Card */}
          <div className='flex items-center gap-4 bg-white p-4 min-w-52 rounded border border-gray-100 shadow-sm hover:scale-105 transition-all cursor-pointer'>
            <img className='w-14' src={assets.earning_icon} alt='Earnings' />
            <div>
              <p className='text-xl font-semibold text-gray-700'>
                {currency || '$'}{dashData.earnings}
              </p>
              <p className='text-gray-400 text-sm'>Earnings</p>
            </div>
          </div>

          {/* Appointments Card */}
          <div className='flex items-center gap-4 bg-white p-4 min-w-52 rounded border border-gray-100 shadow-sm hover:scale-105 transition-all cursor-pointer'>
            <img className='w-14' src={assets.appointments_icon} alt='Appointments' />
            <div>
              <p className='text-xl font-semibold text-gray-700'>{dashData.appointments}</p>
              <p className='text-gray-400 text-sm'>Appointments</p>
            </div>
          </div>

          {/* Patients Card */}
          <div className='flex items-center gap-4 bg-white p-4 min-w-52 rounded border border-gray-100 shadow-sm hover:scale-105 transition-all cursor-pointer'>
            <img className='w-14' src={assets.patients_icon} alt='Patients' />
            <div>
              <p className='text-xl font-semibold text-gray-700'>{dashData.patients}</p>
              <p className='text-gray-400 text-sm'>Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings Feed */}
        <div className='bg-white border rounded-t rounded-b border-gray-200'>
          <div className='flex items-center gap-2.5 px-4 py-4 border-b border-gray-200'>
            <img className='w-5' src={assets.list_icon} alt='Latest Bookings' />
            <p className='font-semibold text-gray-700'>Latest Bookings</p>
          </div>

          <div className='pt-2 divide-y divide-gray-100'>
            {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item, index) => (
                <div
                  key={item._id || index}
                  className='flex items-center px-6 py-3 gap-3 hover:bg-gray-50 transition-all'
                >
                  <img
                    className='rounded-full w-10 h-10 object-cover bg-gray-100'
                    src={item.userData?.image || assets.default_user}
                    alt='Patient'
                  />
                  <div className='flex-1 text-sm'>
                    <p className='text-gray-800 font-medium'>{item.userData?.name || 'N/A'}</p>
                    <p className='text-gray-600 text-xs'>
                      {slotDateFormat ? slotDateFormat(item.slotDate) : item.slotDate} | {item.slotTime}
                    </p>
                  </div>

                  {/* Status Badges or Action Controls */}
                  <div>
                    {item.cancelled ? (
                      <span className='text-red-400 text-xs font-medium'>Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className='text-green-500 text-xs font-medium'>Completed</span>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <img
                          onClick={() => cancelAppointment && cancelAppointment(item._id)}
                          className='w-10 cursor-pointer hover:opacity-75 transition-opacity'
                          src={assets.cancel_icon}
                          alt='Cancel'
                          title='Cancel Appointment'
                        />
                        <img
                          onClick={() => completeAppointment && completeAppointment(item._id)}
                          className='w-10 cursor-pointer hover:opacity-75 transition-opacity'
                          src={assets.tick_icon}
                          alt='Complete'
                          title='Mark Completed'
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-6 text-gray-400 text-sm'>
                No recent bookings found.
              </div>
            )}
          </div>
        </div>
      </div>
    )
  )
}

export default DoctorDashboard