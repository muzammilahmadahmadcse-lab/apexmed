import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  
  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()

  
  const [state, setState] = useState('Sign Up')

  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')


  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-200 rounded-xl text-zinc-600 text-sm shadow-lg bg-white'>
        <p className='text-2xl font-bold text-gray-800'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>
        <p className='text-gray-500'>
          Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment
        </p>

        {/* Full Name input  */}
        {state === 'Sign Up' && (
          <div className='w-full'>
            <p className='font-medium text-gray-700'>Full Name</p>
            <input 
              className='border border-zinc-300 rounded-md w-full p-2 mt-1 focus:outline-primary' 
              type="text" 
              onChange={(e) => setName(e.target.value)} 
              value={name} 
              required 
            />
          </div>
        )}

        {/* Email input */}
        <div className='w-full'>
          <p className='font-medium text-gray-700'>Email</p>
          <input 
            className='border border-zinc-300 rounded-md w-full p-2 mt-1 focus:outline-primary' 
            type="email" 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            required 
          />
        </div>

        {/* Password input */}
        <div className='w-full'>
          <p className='font-medium text-gray-700'>Password</p>
          <input 
            className='border border-zinc-300 rounded-md w-full p-2 mt-1 focus:outline-primary' 
            type="password" 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            required 
          />
        </div>

        {/* Submit Button */}
        <button 
          type='submit' 
          className='bg-primary text-white w-full py-2.5 rounded-md text-base font-medium mt-2 hover:bg-opacity-95 transition-all cursor-pointer'
        >
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        {/* Mode Toggle Link */}
        {state === 'Sign Up' ? (
          <p className='text-gray-500 mt-1'>
            Already have an account?{' '}
            <span 
              onClick={() => setState('Login')} 
              className='text-primary underline cursor-pointer font-medium'
            >
              Login here
            </span>
          </p>
        ) : (
          <p className='text-gray-500 mt-1'>
            Create a new account?{' '}
            <span 
              onClick={() => setState('Sign Up')} 
              className='text-primary underline cursor-pointer font-medium'
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  )
}

export default Login