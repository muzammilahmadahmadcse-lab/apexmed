import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import axios from 'axios'

const Navbar = () => {

  const navigate = useNavigate();

  const {token, setToken, userData, backendUrl} = useContext(AppContext)

  const [showMenu, setShowMenu] = useState(false)

  // ---------- Notifications ----------
  const [notes, setNotes] = useState([])
  const [open, setOpen] = useState(false)
  const unread = notes.filter((n) => !n.read).length

  const fetchNotes = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/notifications',
        {},
        { headers: { token } }
      )
      if (data.success) setNotes(data.notifications)
    } catch (error) {}
  }

  useEffect(() => {
    if (!token) return
    fetchNotes()
    const id = setInterval(fetchNotes, 15000) // refresh every 15 seconds
    return () => clearInterval(id)
  }, [token])

  const toggleBell = async () => {
    const opening = !open
    setOpen(opening)
    if (opening && unread > 0) {
      await axios.post(
        backendUrl + '/api/user/notifications/read',
        {},
        { headers: { token } }
      )
      fetchNotes()
    }
  }
  // -----------------------------------

  const logout = () => {
    setToken(false)               
    localStorage.removeItem('token')
    navigate('/')            
  }
  
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
     
      <img 
        onClick={() => navigate('/')} 
        className='w-44 cursor-pointer' 
        src={ assets.apexmed} 
        alt="ApexMed Logo" 
      />

    
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
          {({ isActive }) => (
            <>
              <li className='py-1'>HOME</li>
              <hr className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${isActive ? 'block' : 'hidden'}`} />
            </>
          )}
        </NavLink>
        <NavLink to='/doctors'>
          {({ isActive }) => (
            <>
              <li className='py-1'>ALL DOCTORS</li>
              <hr className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${isActive ? 'block' : 'hidden'}`} />
            </>
          )}
        </NavLink>
        <NavLink to='/about'>
          {({ isActive }) => (
            <>
              <li className='py-1'>ABOUT</li>
              <hr className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${isActive ? 'block' : 'hidden'}`} />
            </>
          )}
        </NavLink>
        <NavLink to='/contact'>
          {({ isActive }) => (
            <>
              <li className='py-1'>CONTACT</li>
              <hr className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${isActive ? 'block' : 'hidden'}`} />
            </>
          )}
        </NavLink>
      </ul>

      
      <div className='flex items-center gap-4'>
        {
          token 
            ? <>
                {/* Notification bell */}
                <div className='relative'>
                  <button onClick={toggleBell} className='relative text-xl cursor-pointer'>
                    🔔
                    {unread > 0 && (
                      <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5'>
                        {unread}
                      </span>
                    )}
                  </button>

                  {open && (
                    <div className='absolute right-0 mt-2 w-80 max-w-[85vw] max-h-96 overflow-auto bg-white shadow-lg rounded z-50'>
                      {notes.length === 0 && <p className='p-4 text-gray-500'>No notifications yet</p>}
                      {notes.map((n) => (
                        <div
                          key={n._id}
                          className={`p-3 border-b text-sm ${!n.read ? 'bg-blue-50' : ''} ${
                            n.type === 'cancelled'
                              ? 'border-l-4 border-l-red-400'
                              : n.type === 'completed'
                              ? 'border-l-4 border-l-green-400'
                              : ''
                          }`}
                        >
                          <p>{n.message}</p>
                          <p className='text-xs text-gray-400'>{new Date(n.createdAt).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className='flex items-center gap-2 cursor-pointer group relative'>
                  <img className='w-8 rounded-full' src={userData.image} alt="Profile" />
                  <img className='w-2.5' src={assets.dropdown_icon} alt="Dropdown" />
                  <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                    <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-md'>
                      <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                      <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                      <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                    </div>
                  </div>
                </div>
              </>
            : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block cursor-pointer'>Create account</button>
        }

        
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden cursor-pointer' src={assets.menu_icon} alt="Menu" />

       
        <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.apexmed} alt="ApexMed Logo" />
            <img className='w-7 cursor-pointer' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar