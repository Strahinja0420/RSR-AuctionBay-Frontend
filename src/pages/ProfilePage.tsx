import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';

function ProfilePage() {
    const {user} = useAuth();

  return (
    <>
    <TopBar/>
        <p>Email:{user?.email}</p>
        <p>Role:{user?.role}</p>
        <p>Username:{user?.username}</p>
        <Link to="/auctions">Browse Auctions</Link>
    </>
  )
}

export default ProfilePage