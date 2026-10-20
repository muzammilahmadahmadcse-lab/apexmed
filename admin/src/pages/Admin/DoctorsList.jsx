import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-5 gap-y-6'>
        {doctors && doctors.length > 0 ? (
          doctors.map((item, index) => (
            <div
              className='border border-indigo-200 rounded-xl overflow-hidden cursor-pointer group hover:-translate-y-2 transition-all duration-500'
              key={item._id || index}
            >
              
              <div className='bg-indigo-50 group-hover:bg-primary transition-all duration-500 flex justify-center items-end h-56'>
                <img
                  className='max-h-full object-contain transition-all duration-500'
                  src={item.image}
                  alt={item.name}
                />
              </div>

              <div className='p-4'>
                <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                <p className='text-zinc-600 text-sm mt-0.5'>{item.speciality}</p>
                <div className='mt-2.5 flex items-center gap-2 text-sm'>
                  <input
                    type='checkbox'
                    onChange={() => changeAvailability(item._id)}
                    checked={item.available}
                    className='cursor-pointer accent-primary w-4 h-4'
                  />
                  <p className='text-zinc-600 text-sm'>Available</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-500'>No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;