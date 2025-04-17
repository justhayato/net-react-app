import React, { createContext,  useEffect,  useState } from 'react'
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

export function UserContextProvider({children}) {
    const [user, setUser] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let token = localStorage.getItem("token");

        if(token){
            let payload = jwtDecode(token);
            setUser({ name: payload.user_name, email: payload.user_email, id: payload.sub })
        }
        setLoading(false);
    }, []);

  return (
    <UserContext.Provider value={{user, setUser, loading}}>
        {children}
    </UserContext.Provider>
  )
}