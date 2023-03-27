import React, { useState, useEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import { Pin, User } from '../types/schema';

interface Props {
  user: User;
}

const PinDetail: React.FC<Props> = ({ user }) => {
  const [pins, setPins] = useState<Pin[]>();
  const [pinDetail, setPinDetail] = useState<Pin>();
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();

  const fetchPinDetails = () => {
    let query;
    if (pinId) {
      query = pinDetailQuery(pinId);
    }

    if (query) {
      client.fetch(query).then((data) => {
        console.log(data);
        setPinDetail(data[0]);
        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);
          client.fetch(query).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  const addComment = () => {
    if (comment && pinId) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: 'postedBy',
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
          console.log('done');
        });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetail) return <Spinner message='Loading pin...' />;

  return (
    <>
      <div
        className='flex flex-col m-auto bg-white xl:flex-row'
        style={{ maxWidth: '1500px', borderRadius: '32px' }}
      >
        <div className='flex flex-col items-center justify-center flex-initial md-items-start'>
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            alt='user-post'
            className='rounded-b-md rounded-t-xl'
          />
          <div className='flex-1 w-full p-5 xl:min-w-620'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <a
                  href={`${pinDetail.image?.asset.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className='flex items-center justify-center text-xl bg-white rounded-full outline-none opacity-75 w-9 h-9 text-dark hover:opacity-100 hover:shadow-md'
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              <a href={pinDetail.destination} target='_blank' rel='noreferrer'>
                {pinDetail.destination}
              </a>
            </div>
            <div>
              <h1 className='text-2xl font)-bold break-words mt-3'>
                {pinDetail.title}
              </h1>
              <p className='mt-3'>{pinDetail.about}</p>
            </div>
            <Link
              to={`user-profile/${pinDetail.postedBy?._id}`}
              className='flex items-center gap-2 mt-5 bg-white rounded-md'
            >
              <img
                src={pinDetail.postedBy?.image}
                alt='user-profile'
                className='object-cover w-6 h-6 rounded-full'
              />
              <p className='text-xs font-thin capitalize'>
                {pinDetail.postedBy?.userName}
              </p>
            </Link>
            <h2 className='mt-5 text-xl'>Comments</h2>
            <div className='overflow-y-auto max-h-370'>
              {pinDetail?.comments?.map((comment, i) => (
                <div
                  className='flex items-center gap-2 mt-5 bg-white rounded-lg'
                  key={i}
                >
                  <img
                    src={comment.postedBy?.image}
                    alt='user-profile'
                    className='w-10 h-10 rounded-full cursor-pointer'
                  />
                  <div className='flex flex-col'>
                    <p className='font-bold'>{comment.postedBy?.userName}</p>
                    <p>{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex flex-wrap items-center gap-3 mt-6'>
              <Link to={`user-profile/${pinDetail.postedBy?._id}`}>
                <img
                  src={pinDetail.postedBy?.image}
                  alt='user-profile'
                  className='object-cover w-8 h-8 rounded-full'
                />
              </Link>
              <input
                type='text'
                className='flex-1 p-2 border-2 border-gray-100 outline-none rounded-xl focus:border-gray-300'
                placeholder='Add a comment'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className='px-6 py-2 text-base font-semibold text-white bg-red-500 rounded-full outline-none'
                type='button'
                onClick={addComment}
              >
                {addingComment ? 'Posting the comment...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {pins && pins.length > 0 ? (
        <>
          <h2 className='mt-8 mb-4 text-2xl font-bold text-center'>
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message='Loading more pins...' />
      )}
    </>
  );
};

export default PinDetail;
