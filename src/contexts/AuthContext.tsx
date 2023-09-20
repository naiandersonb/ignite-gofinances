import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import { ReactNode, createContext, useContext, useState } from "react";

const { CLIENT_ID, REDIRECT_URI } = process.env

interface AuthProviderProps {
  children: ReactNode
}

interface User {
  id: string
  name: string
  email: string
  photo?: string
}

interface AuthContextData {
  user: User
  signInWithApple(): Promise<void>
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const RESPONSE_TYPE = 'token'
  const SCOPES = ['profile', 'email']

  const [user, setUser] = useState<User>({} as User)


  async function signInWithGoogle() {
    try {
      // código de autenticação aqui

    } catch (error: any) {
      console.log({ error });
    }
  };

  async function signInWithApple() {
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      })

      console.log({ credentials })

      if (credentials) {
        const userLogged: User = {
          id: credentials.user,
          email: credentials.email!,
          name: credentials.fullName!.givenName!,
          photo: undefined
        }

        setUser(userLogged)
        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged))
      }


    } catch (error: any) {
      console.log({ error })
      throw new Error(error)
    }
  };


  return (
    <AuthContext.Provider value={{
      user,
      signInWithApple
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)