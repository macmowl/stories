import { useState, useEffect } from 'react';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import logo from '../assets/logo.png';
import videobg from '../assets/videobg.mp4';
import { client } from '../client';

const Login = () => {
  const [user, setUser] = useState<TokenResponse>();
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: (codeResponse: TokenResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error),
  });

  const getUserData = async (user: TokenResponse) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`
      );
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data));
      const { name, id, picture } = data;
      const doc = {
        _id: id,
        _type: 'user',
        userName: name,
        image: picture,
      };
      client.createIfNotExists(doc).then(() => {
        navigate('/', { replace: true });
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (user) {
      getUserData(user);
    }
  }, [user]);

  return (
    <div className='flex justify-start item-center flex-col h-screen'>
      <div className='relative w-full h-screen'>
        <video
          src={videobg}
          loop
          muted
          autoPlay
          controls={false}
          className='w-full h-full object-cover'
        />
        <div className='absolute flex flex-col justify-center items-center bg-blackOverlay bottom-0 top-0 left-0 right-0 '>
          <div className='p-5 bg-white rounded flex flex-col justify-center items-center gap-4'>
            <img src={logo} alt='logo' width='130' />
            <button
              onClick={() => login()}
              type='button'
              className='flex items-center gap-2 rounded-lg border-gray-300'
            >
              <FcGoogle /> Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
