import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='px-4 sm:px-10'>
      {/* ---------- Header Title ---------- */}
      <div className='text-center text-2xl pt-10 text-black-500 font-bold'>
        <p>ABOUT <span className='text-black-700 font-bold'>US</span></p>
      </div>

      {/* ---------- About Us Section ---------- */}
      <div className='my-10 flex flex-col md:flex-row items-center justify-center gap-12'>
        <img className='w-full md:max-w-[360px] rounded-lg object-cover' src={assets.about_image} alt="About Us" />
        
        <div className='flex flex-col justify-center gap-6 md:w-2/3 text-sm text-gray-600 leading-relaxed'>
          <p>
            Welcome to <b className='text-gray-800'>ApexMed</b>, your trusted partner in managing your healthcare needs conveniently and efficiently. At ApexMed, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
          </p>
          <p>
            ApexMed is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, ApexMed is here to support you every step of the way.
          </p>
          <b className='text-gray-800 text-base font-bold'>Our Vision</b>
          <p>
            Our vision at ApexMed is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
          </p>
        </div>
      </div>

      {/* ---------- Why Choose Us Title ---------- */}
      <div className='text-xl my-6 text-gray-700 font-bold'>
        <p>WHY <span className='text-gray-900 font-bold'>CHOOSE US</span></p>
      </div>

      {/* ---------- Feature Cards Grid ---------- */}
      <div className='flex flex-col md:flex-row mb-20 gap-4 md:gap-0'>
        <div className='border border-gray-200 px-10 md:px-12 py-8 md:py-12 flex flex-col gap-4 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-lg md:rounded-none md:rounded-l-lg'>
          <b className='font-bold'>EFFICIENCY:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>

        <div className='border border-gray-200 px-10 md:px-12 py-8 md:py-12 flex flex-col gap-4 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-lg md:rounded-none'>
          <b className='font-bold'>CONVENIENCE:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>

        <div className='border border-gray-200 px-10 md:px-12 py-8 md:py-12 flex flex-col gap-4 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-lg md:rounded-none md:rounded-r-lg'>
          <b className='font-bold'>PERSONALIZATION:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default About