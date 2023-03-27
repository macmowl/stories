import React from 'react';
import Masonry from 'react-masonry-css';
import { Pin as PinSchema } from '../types/schema';
import Pin from './Pin';

const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  100: 2,
  500: 1,
};

interface Props {
  pins: PinSchema[];
}

const MasonryLayout: React.FC<Props> = ({ pins }) => {
  return (
    <Masonry className='flex animate-slide-fwd' breakpointCols={breakpointObj}>
      {pins.map((pin) => (
        <Pin key={pin._id} pin={pin} />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
