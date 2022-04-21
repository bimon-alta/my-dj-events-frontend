import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NEXT_URL } from "@/config/index";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();


  // GA TAU JIKA useEffect return nya non Object, MAKA AKAN SELALU ERROR
  useEffect(() => {checkUserLoggedIn()}, []);

  // Register User
  const register = async (user) => {
    // console.log(user);
    // console.log({identifier, password});
    const res = await fetch(`${NEXT_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user),
    });

    const data = await res.json();


    if(res.ok) {
      setUser(data.user);
      router.push('/account/dashboard');
      
    }else{
      setError(data.message);

      // Akal-akalan sendiri dgn timeout, jika tidak maka pesan error auto null sblm di render ulang
      setTimeout(() => {
        setError(null);
      }, 1000);
      
    }
  }

  // Login User
  const login = async ({email: identifier, password}) => {  // destruktur args dgn props `email` lalu di-rename ke `identifier`
    // console.log({identifier, password});
    const res = await fetch(`${NEXT_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier,
        password
      }),
    });

    const data = await res.json();

    // console.log(data);

    if(res.ok) {
      setUser(data.user);
      router.push('/account/dashboard');
      
    }else{
      // console.log('Data message : ', data.message);
      setError(data.message);

      // Akal-akalan sendiri dgn timeout, jika tidak maka pesan error auto null sblm di render ulang
      setTimeout(() => {
        setError(null);
      }, 1000);
      
    }
  }

  // Logout User
  const logout = async () => {  // destruktur args dgn props `email` lalu di-rename ke `identifier`
    // console.log('Logout');
    const res = await fetch(`${NEXT_URL}/api/logout`, {
      method: 'POST'
    });

    if(res.ok) {
      setUser(null);
      router.push('/');
    }
  }

  // Check if user is logged in
  const checkUserLoggedIn = async (user) => {
    // console.log('Check');
    const res = await fetch(`${NEXT_URL}/api/user`);
    const data = await res.json();

    if(res.ok) {
      setUser(data.user);
      // setTimeout(() => {
      //   setUser(data.user);
      // }, 1000);
    }else{
      setUser(null);
      // setTimeout(() => {
      //   setUser(null);
      // }, 1000);
    }
  }



  return (
    <AuthContext.Provider value={{user, error, register, login, logout}}>
      {children}
    </AuthContext.Provider>
  )


}


export default AuthContext;