import React from 'react'
import AddNew from './AddNew'

import UserInfo from './UserInfo'
import SearchBar from './SearchBar'
import { useUserStore } from '@/app/store/userStore'

function UserControl() {
  
const {user , logout , setUser} = useUserStore()
  return (
        <div className='flex items-center jutsify-center gap-x-6'>
    
            <UserInfo user={user} logout={logout} setUser={setUser}/>  
            <SearchBar/>
        </div>
  )
}

export default UserControl