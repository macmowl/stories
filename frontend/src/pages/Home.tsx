import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';
import { Sidebar, UserProfile } from '../components';
import Pins from './Pins';
import { client } from '../client';
import logo from '../assets/logo.png';
import { userQuery } from '../utils/data';
import type * as Schema from '../types/schema';
import { fetchUser } from '../utils/fetchUser';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState<Schema.User>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const userInfo = fetchUser();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
    const query = userQuery(userInfo?.id);
    client.fetch(query).then((res) => {
      setUser(res[0]);
    });
  }, []);

  return (
    <div className='flex bg-gray-50 flex-col md:flex-row h-screen transaction-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        {user && <Sidebar user={user} />}
      </div>
      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu
            fontSize={30}
            className='cursor-pointer'
            onClick={() => setToggleSidebar(true)}
          />
          <Link to='/'>
            <img src={logo} alt='logo' className='w-28' />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt='logo' className='w-14 rounded-full' />
          </Link>
        </div>
        {toggleSidebar && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute w-full flex justify-end items-center p-2'>
              <AiFillCloseCircle
                fontSize={30}
                className='cursor-pointer'
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            {user && (
              <Sidebar user={user && user} closeToggle={setToggleSidebar} />
            )}
          </div>
        )}
      </div>
      <div className='pb-2 flex-1 h-screen overflow-y-scroll ' ref={scrollRef}>
        <Routes>
          <Route path='/user-profile/:userId' element={<UserProfile />} />
          {user && <Route path='/*' element={<Pins user={user} />} />}
        </Routes>
      </div>
    </div>
  );
};

export default Home;
