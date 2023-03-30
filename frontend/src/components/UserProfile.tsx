import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { Pin, User } from '../types/schema';

const randomImage = `https://source.unsplash.com/1600x900/?nature,photography,technology`;
const activeBtnStyles =
  'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles =
  'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = () => {
  const [user, setUser] = useState<User>();
  const [pins, setPins] = useState<Pin[]>();
  const [text, setText] = useState<string | null>('created');
  const [activeBtn, setActiveBtn] = useState<string>('created');
  const navigate = useNavigate();
  const { userId } = useParams();

  const logout = () => {
    localStorage.clear();
    googleLogout();
    navigate('/');
  };

  useEffect(() => {
    if (userId) {
      const query = userQuery(userId);
      client.fetch(query).then((data) => {
        setUser(data[0]);
      });
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      if (text === 'Created') {
        const createdPinsQuery = userCreatedPinsQuery(userId);
        client.fetch(createdPinsQuery).then((data) => {
          setPins(data);
        });
      } else {
        const savedPinsQuery = userSavedPinsQuery(userId);
        client.fetch(savedPinsQuery).then((data) => {
          setPins(data);
        });
      }
    }
  }, [text, userId]);

  if (!user) <Spinner message='Loading profile' />;

  return (
    <div className='relative justify-center h-full pb-2'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col items-center justify-center'>
            <img
              src={randomImage}
              alt='banner-picture'
              className='object-cover w-full shadow-lg h-370 2xl:h-510'
            />
            <img
              src={user?.image}
              alt='user-pic'
              className='object-cover w-20 h-20 -mt-10 rounded-full shadow-xl'
            />
            <h1 className='mt-3 text-3xl font-bold text-center'>
              {user?.userName}
            </h1>
            <div className='absolute top-0 right-0 p-2 z-1'>
              {userId === user?._id && (
                <button
                  onClick={logout}
                  className='p-2 bg-white rounded-full shadow-md outline-none cursor-pointer'
                >
                  <AiOutlineLogout color='red' fontSize={21} />
                </button>
              )}
            </div>
          </div>
          <div className='text-center mb-7'>
            <button
              type='button'
              onClick={(e) => {
                const target = e.target as HTMLButtonElement;
                setText(target.textContent);
                setActiveBtn('created');
              }}
              className={`${
                activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type='button'
              onClick={(e) => {
                const target = e.target as HTMLButtonElement;
                setText(target.textContent);
                setActiveBtn('saved');
              }}
              className={`${
                activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>
          <div className='px-2'>
            {pins?.length ? (
              <MasonryLayout pins={pins} />
            ) : (
              <div className='flex items-center justify-center w-full mt-2 text-xl font-bold'>
                No pins
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
