import React from 'react';
import DotLoader from 'react-spinners/DotLoader';

interface Props {
  message?: string;
}

const Spinner: React.FC<Props> = ({ message }) => {
  return (
    <div className='flex flex-col items-center justify-center w-full h-full gap-4'>
      <DotLoader
        color='#3E1E71'
        loading
        size={40}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
      {message && <p className='px-2 text-lg text-center'>{message}</p>}
    </div>
  );
};

export default Spinner;
