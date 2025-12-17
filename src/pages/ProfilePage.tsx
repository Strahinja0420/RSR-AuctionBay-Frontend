import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom';

function ProfilePage() {
    const {user} = useAuth();

  return (
    <>
        <p>Email:{user?.email}</p>
        <p>Role:{user?.role}</p>
        <p>Username:{user?.username}</p>
        <Link to="/auctions">Browse Auctions</Link>
    </>
  )
}

export default ProfilePage