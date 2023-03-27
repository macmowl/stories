import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { MasonryLayout, Spinner } from '../components';
import { Pin } from '../types/schema';
import { feedQuery, searchQuery } from '../utils/data';

const Feed = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pins, setPins] = useState<Pin[]>([]);
  const { category } = useParams();

  const getPins = async () => {
    let data = [];
    try {
      if (category) {
        const query = searchQuery(category);
        data = await client.fetch(query);
      } else {
        data = await client.fetch(feedQuery);
      }
      setPins(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setLoading(true);
    getPins();
  }, [category]);

  if (loading)
    return <Spinner message='We are adding new ideas to your feed' />;

  if (pins.length === 0)
    return (
      <p className='font-thin text-center text-gray-500'>
        There is no pin for this category
      </p>
    );
  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
