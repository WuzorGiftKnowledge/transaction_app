import Head from 'next/head'
import styles from '../styles/styles/pageStyles/login.module.scss'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/client'
import { async } from 'rxjs'

export default  function Login () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoginStarted, setIsLoginStarted] = useState(false)
  const [loginError, setLoginError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (router.query.error) {
      setLoginError(router.query.error)
      setUsername(router.query.username)
    }
  }, [router])

  const handleLogin = (e) =>async()=> {
    e.preventDefault()
    setIsLoginStarted(true)
  const res= await  signIn('credentials',
      {
        username,
        password,
        callbackUrl: `${window.location.origin}`,
       
      }
    )
   
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Login Page</title>
      </Head>
      <main className={styles.loginMain}>
        <div className={styles.loginStep}>
          <h1>Welcome Back</h1>
          <form onSubmit={(e) => handleLogin(e)} className={styles.loginForm}>
            <label htmlFor='loginUsername'>Username</label>
            <input id='loginUsername' type='email' value={username} onChange={(e) => setUsername(e.target.value)} className={loginError ? styles.errorInput : ''} />
            <span className={styles.error}>{loginError}</span>
            <label htmlFor='inputPassword'>Password</label>
            <input id='inputPassword' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type='submit' disabled={isLoginStarted} className={styles.blueButtonRound}>Log In</button>
          </form>
        </div>
      </main>
    </div>
  )
}
