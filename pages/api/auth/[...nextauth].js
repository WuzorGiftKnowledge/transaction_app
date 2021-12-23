import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import axios from 'axios'
import getConfig from 'next/config';


const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;


const providers = [
  Providers.Credentials({
    name: 'Credentials',
    authorize: async (credentials) => {
      try {
        const user = await axios.post('/login',
        {
          user: {
            password: credentials.password,
            username: credentials.username
          }
        },
        {
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json'
          }
        })

        if (user) {
         
          return {status: 'success', data: user.data.user}
         
        } 
      } catch (e) {
        const errorMessage = e.response.data.message
        // Redirecting to the login page with error messsage in the URL
        throw new Error(errorMessage + '&username=' + credentials.username)
      }

    }
  })
],
callbacks = {
  async jwt(token, user) {
    if (user) {
      token.accessToken = user?.accessTokentoken;
      token.user=user.user;
      token.jwt=user.jwt;
    }

    return Promise.resolve(token);
  },

 async session(session, token) {
     session.jwt=token.jwt;

    session.accessToken = token.accessToken;
    session.user=token.user ?token.user :session.user

    
    return Promise.resolve(session);
  },
}


const options = {
  providers,
  callbacks,
  pages: {
    error: '/login' // Changing the error redirect page to our custom login page
  }
}

export default (req, res) => NextAuth(req, res, options)