import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar, Feed, PinDetail, CreatePin, Search } from '../components';
import { User } from '../types/schema';

interface Props {
  user: User;
}

const Pins: React.FC<Props> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  return (
    <div className='px-2 md:px-5'>
      <div className='bg-gray-50'>
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>
      <div className='h-full'>
        <Routes>
          <Route path='/' element={<Feed />} />
          <Route path='/category/:category' element={<Feed />} />
          <Route
            path='/pin-detail/:pinId'
            element={<PinDetail user={user} />}
          />
          <Route path='/create-pin' element={<CreatePin user={user} />} />
          <Route
            path='/search'
            element={
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
