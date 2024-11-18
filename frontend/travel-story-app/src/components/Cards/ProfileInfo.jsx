import React from 'react'
import { getInitials } from '../../utils/helper'


const ProfileInfo = ({userInfo,onLogout}) => {
  return (
   userInfo && <div className='flex items-centre gap-3 overflow-hidden'>
        
     <div className='w-12 h-12 flex items-center justify-center rounded-full text-white font-medium bg-cyan-400'>
       {getInitials(userInfo?userInfo.fullName:"")}
     </div>



     <div className="flex flex-col justify-center items-center md:flex-row gap-2">
     <p className='hidden lg:inline-block text-sm font-medium'>{userInfo.fullName}</p>
     <button className='text-sm text-slate-800 underline' onClick={onLogout}>
       Logout
     </button>
     </div>

    </div>
  )
}

export default ProfileInfo
