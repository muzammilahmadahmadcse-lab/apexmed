import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

    
        <div>
          <img className='mb-5 w-40' src={assets.apexmed} alt="Prescripto Logo" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>
            ApexMed is a seamless healthcare booking platform designed to connect patients with verified medical specialists effortlesly. Book appointments, track schedules, and consult with top doctors anytime.
          </p>
        </div>

    
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li className='cursor-pointer hover:text-black transition-all'>Home</li>
            <li className='cursor-pointer hover:text-black transition-all'>About us</li>
            <li className='cursor-pointer hover:text-black transition-all'>Contact us</li>
            <li className='cursor-pointer hover:text-black transition-all'>Privacy policy</li>
          </ul>
        </div>

        
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+1 (800) 275-8777</li>
            <li>support@apexmed.health</li>
          </ul>
        </div>

      </div>

      
      <div>
        <hr />
        <p className='py-5 text-sm text-center text-gray-500'>
          
        </p>
      </div>
    </div>
  )
}

export default Footer