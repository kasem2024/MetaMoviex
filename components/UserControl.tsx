import React from 'react'
import AddNew from './AddNew'
import Language from './Language'
import Notification from './Notification'
import UserInfo from './UserInfo'
import SearchBar from './SearchBar'
import { useUserStore } from '@/app/store/userStore'

function UserControl() {
const {user , logout , setUser} = useUserStore()
  return (
        <div className='flex items-center jutsify-center'>
            <AddNew/>
            <Language/>
            <Notification/>
            <UserInfo user={user} logout={logout} setUser={setUser}/>  
            <SearchBar/>
        </div>
  )
}

export default UserControl