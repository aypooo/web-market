import type { NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { getFingerprint } from '../../utils/client/fingerprint'
import Link from 'next/link'
import loginStyle from '../../styles/login/login.module.css'
import useCustomSWR from '../../utils/client/useCustumSWR'
import customAxios from '../../utils/customAxios'
import { loginQuery } from '../api/login'
import Loading from '../../component/Loading'


const Home: NextPage = () => {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [persistent, setPersistent] = useState(false)
  const router = useRouter()

  //id 입력감지 후 id 값 변경
  const IdInputHandler = (event: any) => {
    setId(event.currentTarget.value)
  }

  const PasswordInputHandler = (event: any) => {
    setPassword(event.currentTarget.value)
  }

  const persistentInputHandler = (event: any) => {
    setPersistent(prevState => { return !prevState })
  }
  async function login(event: any) {
    event.preventDefault()
    try {
      const fingerprint = await getFingerprint()
      const loginQuery: loginQuery = { id, password, fingerprint, persistent }
      const res = await customAxios.post("/api/login", loginQuery)
      if (res.status == 200) {
        alert(`${id}님 환영합니다!`)
        router.push("/")
      } else {
        alert("아이디 혹은 비밀번호가 틀렸습니다")
      }
    } catch (error) {
      alert("서버 에러가 발생하였습니다")
    }
  }
  const { data, isLoading, isServerError } = useCustomSWR("/api/user/me", {}, true)
  if (isLoading) return <div><Loading /></div>
  if (isServerError) {
    alert("서버 에러가 발생하였습니다")
    router.push("/")
  }
  if (data) {
    alert("이미 로그인되어 있습니다")
    router.push("/")
  }

  return (
    <div className={loginStyle.container}>
      <div className={loginStyle.content}>
        <form>
          <div className={loginStyle.login_wrap}>
            <Link href="/" passHref>
              <div className={loginStyle.logo}></div>
            </Link>
            <div className={loginStyle.id_pw_wrap}>
              <label>
                {/* ID */}
                <input type="text" value={id} onChange={IdInputHandler} placeholder="아이디" />
              </label>
              <label>
                {/* PW */}
                <input type="password" value={password} onChange={PasswordInputHandler} placeholder='비밀번호' />
              </label>
            </div>
            <div className={loginStyle.keep_login}>
              <label >
                <span>로그인 유지</span>
                <input type="checkbox" onChange={persistentInputHandler} />
              </label>
            </div>
            <div className={loginStyle.login_btn}>
              <button onClick={login}>로그인</button>
            </div>
            <div className={loginStyle.signup_btn}>
              <Link href="/signup" passHref>
                <span>회원가입</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Home
