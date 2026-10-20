import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className='px-4 sm:px-10'>
      {/* ---------- Header Title ---------- */}
      <div className='text-center text-2xl pt-10 text-black-500 font-bold'>
        <p>CONTACT <span className='text-gray-700 font-bold'>US</span></p>
      </div>

      {/* ---------- Contact Details Section ---------- */}
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px] rounded-lg object-cover' src={assets.contact_image} alt="Contact Us" />

        <div className='flex flex-col justify-center items-start gap-6 leading-relaxed'>
          <p className='font-bold text-lg text-gray-800'>OUR OFFICE</p>
          <p className='text-gray-500'>
            54709 Apex Medical Plaza <br />
            Suite 350, Washington, USA
          </p>
          <p className='text-gray-500'>
            Tel:(415) 555-0132 <br />
            Email: support@apexmed.com
          </p>

          <p className='font-bold text-lg text-gray-800 mt-2'>CAREERS AT APEXMED</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>

          <button className='border border-black px-8 py-4 text-sm font-medium hover:bg-black hover:text-white transition-all duration-500 rounded-sm cursor-pointer'>
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  )
}

export default Contact