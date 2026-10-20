import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {

  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)


  const getAddress = () => {
    if (!userData?.address) return { line1: '', line2: '' }
    if (typeof userData.address === 'string') {
      try {
        return JSON.parse(userData.address)
      } catch (e) {
        return { line1: userData.address, line2: '' }
      }
    }
    return userData.address
  }

  const currentAddress = getAddress()

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()

      formData.append('name', userData.name || '')
      formData.append('phone', userData.phone || '')
    
      formData.append('address', JSON.stringify(currentAddress))
      formData.append('gender', userData.gender || 'Not Selected')
      formData.append('dob', userData.dob || '')

      if (image) formData.append('image', image)

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  if (!userData) {
    return (
      <div className='min-h-[60vh] flex items-center justify-center text-gray-500'>
        Loading profile...
      </div>
    )
  }

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>

      {/* profile image */}
      {isEdit ? (
        <label htmlFor="image" className='relative cursor-pointer w-36 inline-block'>
          <img 
            className='w-36 rounded opacity-75' 
            src={image ? URL.createObjectURL(image) : (userData.image || assets.profile_pic)} 
            alt="Profile" 
          />
          <div className='absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md'>
            <img className='w-4' src={assets.upload_icon} alt="Upload" />
          </div>
          <input 
            onChange={(e) => setImage(e.target.files[0])} 
            type="file" 
            id="image" 
            hidden 
          />
        </label>
      ) : (
        <img className='w-36 rounded' src={userData.image || assets.profile_pic} alt="Profile" />
      )}

      {/* user name*/}
      {isEdit ? (
        <input 
          className='bg-gray-50 text-3xl font-medium max-w-60 mt-4 border border-gray-300 rounded p-1 focus:outline-primary' 
          type="text" 
          value={userData.name || ''} 
          onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} 
        />
      ) : (
        <p className='font-bold text-3xl text-neutral-800 mt-4'>{userData.name || 'User Name'}</p>
      )}

      <hr className='bg-zinc-400 h-[1px] border-none my-2' />

      {/* contact info */}
      <div>
        <p className='text-neutral-500 underline font-semibold mb-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 text-neutral-700'>
          
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email || 'N/A'}</p>

          <p className='font-medium'>Phone:</p>
          {isEdit ? (
            <input 
              className='bg-gray-100 max-w-52 border border-gray-300 rounded p-1 focus:outline-primary' 
              type="text" 
              value={userData.phone || ''} 
              onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
            />
          ) : (
            <p className='text-blue-400'>{userData.phone || '000-000-0000'}</p>
          )}

          <p className='font-medium'>Address:</p>
          {isEdit ? (
            <div>
              <input 
                className='bg-gray-50 border border-gray-300 rounded p-1 mb-1 w-full focus:outline-primary' 
                onChange={(e) => setUserData(prev => ({ 
                  ...prev, 
                  address: { ...currentAddress, line1: e.target.value } 
                }))} 
                value={currentAddress.line1} 
                type="text" 
              />
              <input 
                className='bg-gray-50 border border-gray-300 rounded p-1 w-full focus:outline-primary' 
                onChange={(e) => setUserData(prev => ({ 
                  ...prev, 
                  address: { ...currentAddress, line2: e.target.value } 
                }))} 
                value={currentAddress.line2} 
                type="text" 
              />
            </div>
          ) : (
            <p className='text-gray-500'>
              {currentAddress.line1}
              <br />
              {currentAddress.line2}
            </p>
          )}
        </div>
      </div>

      {/* basic info */}
      <div>
        <p className='text-neutral-500 underline font-semibold my-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 text-neutral-700'>
          
          <p className='font-medium'>Gender:</p>
          {isEdit ? (
            <select 
              className='max-w-28 bg-gray-100 border border-gray-300 rounded p-1 focus:outline-primary' 
              onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} 
              value={userData.gender || 'Not Selected'}
            >
              <option value="Not Selected">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className='text-gray-400'>{userData.gender || 'Not Selected'}</p>
          )}

          <p className='font-medium'>Birthdate:</p>
          {isEdit ? (
            <input 
              className='max-w-36 bg-gray-100 border border-gray-300 rounded p-1 focus:outline-primary' 
              type="date" 
              onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} 
              value={userData.dob === 'Not Selected' ? '' : (userData.dob || '')} 
            />
          ) : (
            <p className='text-gray-400'>{userData.dob || 'Not Selected'}</p>
          )}

        </div>
      </div>

      {/*action button */}
      <div className='mt-10 mb-10'>
        {isEdit ? (
          <button 
            className='border border-primary px-8 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all duration-300 font-medium cursor-pointer' 
            onClick={updateUserProfileData}
          >
            Save Information
          </button>
        ) : (
          <button 
            className='border border-primary px-8 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all duration-300 font-medium cursor-pointer' 
            onClick={() => setIsEdit(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

    </div>
  )
}

export default MyProfile