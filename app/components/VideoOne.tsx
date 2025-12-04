import React from 'react';

const VideoOne = () => {
  return (
    <video
      width='700'
      height='100'
      muted
      autoPlay
      loop
      playsInline
      className='shadow-lg shadow-gray-500'
    >
      <source src='https://uttkgexdc6.ufs.sh/f/l2Zi8yDbeJCSmnt2pI8DImuXGlExPTNg0CnH7yeqf6vaFOk8' />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoOne;
