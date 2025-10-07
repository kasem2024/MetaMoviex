import Link from 'next/link'
import React from 'react';
import { User } from '@/types';


interface Props {
    user:User | null,
    logout:()=>void,
    setUser:(user:User | null)=>void
}

function UserInfo({user, logout , setUser}: Props) {

  

    return (
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <span>Hello, {user.username}</span>
            {user.avatar?.tmdb?.avatar_path && (
              <img
                src={`https://image.tmdb.org/t/p/w45${user.avatar.tmdb.avatar_path}`}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
            >
            Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">
            Login
          </Link>
        )}
      </div>
    )
}

export default UserInfo
