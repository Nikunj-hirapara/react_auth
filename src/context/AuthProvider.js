import create from "zustand";
import createContext from "zustand/context";
import { persist } from "zustand/middleware";
import axios from "../api/axios";
const LOGIN_URL = "/auth";
const REGISTER_URL = "/register";

const { Provider, useStore } = createContext();

const createStore = () =>
  create(
    persist((set) => ({
      user: "",
      accessToken: "",
      roles: [],
      login: async ({ user, pwd }) => {
        try {          
          const response = await axios.post(
            LOGIN_URL,
            JSON.stringify({ user, pwd }),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          set(() => ({
            user: user,
            accessToken: response?.data?.accessToken,
            roles: response?.data?.roles,
          }));
          return [true,null]
        } catch (err) {
            if (!err?.response) {
              return [null,'No Server Response']
            } else if (err.response?.status === 400) {
              return [null,'Missing user or Password']
            } else if (err.response?.status === 401) {
              return [null,'Unauthorized']
            } else {
              return [null,'Login Failed']
          }
        }
      },
      register: async ({ user, pwd }) => {
        try {
          await axios.post(REGISTER_URL, JSON.stringify({ user, pwd }), {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          });
          set({
            user: "",
            accessToken: '',
            roles: [],
          });
          return [true,null]
        } catch (err) {
            if (!err?.response) {
              return [null,'No Server Response']
            } else if (err.response?.status === 409) {              
              return [null,'Username Taken']
            } else {
              return [null,'Registration Failed']
            }
        }        
      },
      logout:()=> {
        set({
          user:'',
          accessToken: "",
          roles: [],
        })
      },
      refreshToken: async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        set({accessToken: response?.data?.accessToken});
        return response?.data?.accessToken
      }
    }))
  );

export const AuthProvider = ({ children }) => {
  return <Provider createStore={createStore}>{children}</Provider>;
};

export default useStore;