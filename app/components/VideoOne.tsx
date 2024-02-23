import React from 'react';

const VideoOne = () => {
  return (
    <video
      width='700'
      height='100%'
      muted
      autoPlay
      loop
      playsInline
      className='shadow-lg shadow-slate-400'
    >
      <source src='https://res.cloudinary.com/dtjasyr7k/video/upload/v1708727592/7f332d8a-a2e9-404a-8cc2-c9bdd98bd6b8_jz8vup.mp4' />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoOne;
