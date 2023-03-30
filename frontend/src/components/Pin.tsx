import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { client, urlFor } from '../client';
import { Pin as PinSchema, PostedBy } from '../types/schema';
import { fetchUser } from '../utils/fetchUser';
import { PatchSelection } from '@sanity/client';

interface Props {
  pin: PinSchema;
}

const Pin: React.FC<Props> = ({ pin }) => {
  const [postHovered, setPostHovered] = useState<boolean>(false);
  const [savingPost, setSavingPost] = useState<boolean>(false);
  const navigate = useNavigate();
  const user = fetchUser();

  const alreadySaved = !!pin?.save?.filter(
    (item) => item?.postedBy?._id === user.id
  )?.length;

  const savePin = (id: PatchSelection) => {
    if (!alreadySaved) {
      setSavingPost(true);
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [
          {
            _key: uuidv4(),
            userId: user.id,
            postedBy: {
              _type: 'postedBy',
              _ref: user.id,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  };

  const deletePin = (id: string) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className='flex flex-col gap-1 m-2'>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${pin._id}`)}
        className='relative w-auto overflow-hidden transition-all duration-500 ease-in-out rounded-lg cursor-zoom-in hover:shadow-lg'
      >
        <img
          src={urlFor(pin.image!).width(250).url()}
          alt='user-post'
          className='w-full rounded-lg'
        />
        {postHovered && (
          <div
            className='absolute top-0 z-50 flex flex-col justify-between w-full h-full p-3 md:p-2'
            style={{ height: '100%' }}
          >
            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                <a
                  href={`${pin.image?.asset.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className='flex items-center justify-center text-xl bg-white rounded-full outline-none opacity-75 text-dark hover:opacity-100 hover:shadow-md md:p-1'
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type='button'
                  className='px-5 py-1 text-base font-bold text-white bg-red-500 outline-none opacity-75 hover:opacity-100 rounded-3xl hover:shadow-md md:py-2 md:px-1 md:text-sm md:font-normal'
                >
                  {pin.save?.length} Saved
                </button>
              ) : (
                <button
                  type='button'
                  className='px-4 py-2 text-base font-bold text-white bg-red-500 outline-none opacity-75 hover:opacity-100 rounded-3xl hover:shadow-md'
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(pin._id);
                  }}
                >
                  {savingPost ? 'Saving' : 'Save'}
                </button>
              )}
            </div>
            <div className='flex items-center justify-between w-full gap-2'>
              {pin.destination && (
                <a
                  href={pin.destination}
                  target='_blank'
                  rel='nonreferrer'
                  className='flex items-center gap-2 px-4 py-2 font-bold text-black bg-white rounded-full opacity-70 hover:opacity-100 hover:shadow-md md:p-1'
                >
                  <BsFillArrowUpRightCircleFill />
                  <p className='block md:hidden'>
                    {pin.destination.length > 20
                      ? pin.destination.slice(8, 17)
                      : pin.destination.slice(8)}
                  </p>
                </a>
              )}
              {pin.postedBy?._id === user.id && (
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(pin._id);
                  }}
                  className='p-3 text-base font-bold bg-white rounded-full outline-none opacity-75 text-dark hover:opacity-100 hover:shadow-md md:p-1'
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/user-profile/${pin.postedBy?._id}`}
        className='flex items-center gap-2'
      >
        <img
          src={pin.postedBy?.image}
          alt='user-profile'
          className='object-cover w-6 h-6 rounded-full'
        />
        <p className='text-xs font-thin capitalize'>{pin.postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
