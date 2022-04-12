import styles from '../../styles/HeaderCompo.module.css'
import Link from 'next/link'
import useCustomSWR from '../../utils/client/useCustumSWR'
import MenuToggle from '../menutoggle/MenuToggle'
import { NextPage } from 'next'
import { Default, Moblie } from '../responsive'

const HeaderCompo: NextPage = () => {
    const { data, isLoading, isApiError, isServerError } = useCustomSWR("/api/user/me")
    if (isLoading) return <div>로딩중...</div>
    if (isServerError) {
        alert("서버 에러가 발생하였습니다")
    }
    const role = data?.role
    return (
        <>
            <Default>
                <div className={styles.header}>
                    <div className={styles.headbar}>

                        <div className={styles.category}>
                            <MenuToggle />
                            <Link href="/" passHref>
                                <div className={styles.logo}></div>
                            </Link>
                        </div>

                        <div className={styles.searchcontainer}>
                            <div className={styles.search}>
                                <input type="text" />
                                <button></button>
                            </div>
                        </div>
                        {
                            isApiError
                                ? <>
                                    <div className={styles.logingroup}>
                                        <Link href="/login" passHref>
                                            <div className={styles.loginBtn}>로그인</div>
                                        </Link>
                                        <span>|</span>
                                        <Link href="/signup" passHref>
                                            <div className={styles.loginBtn}>회원가입</div>
                                        </Link>
                                    </div>
                                    <div className={styles.mypage}>
                                        <Link href="/mypage" passHref>
                                            <div className={styles.mypagebtn}>
                                            </div>
                                        </Link>
                                        <div className={styles.itemBox}>
                                        </div>
                                    </div>
                                </>
                                : role === "admin"
                                    ? <>
                                        <div className={styles.logingroup}>
                                            <Link href="/admin" passHref>
                                                <div>
                                                    관리자
                                                </div>
                                            </Link>
                                            <span>|</span>
                                            <Link href="/api/logout" passHref>
                                                <div className={styles.loginbtn}>로그아웃</div>
                                            </Link>
                                        </div>
                                        <div className={styles.mypage}>
                                            <Link href="/mypage" passHref>
                                                <div className={styles.mypagebtn}>
                                                </div>
                                            </Link>
                                            <div className={styles.itemBox}>
                                            </div>
                                        </div>
                                    </>
                                    : <>
                                        <div className={styles.logingroup}>
                                            <Link href="/api/logout" passHref>
                                                <div className={styles.loginbtn}>로그아웃</div>
                                            </Link>
                                        </div>
                                        <div className={styles.mypage}>
                                            <Link href="/mypage" passHref>
                                                <div className={styles.mypagebtn}>
                                                </div>
                                            </Link>
                                            <div className={styles.itemBox}>
                                            </div>
                                        </div>
                                    </>
                        }
                    </div>
                </div >
            </Default>
            <Moblie>
                <div className={styles.header}>
                    <div className={styles.headbarMoblie}>
                        <div className={styles.categoryMobile}>
                            <MenuToggle />

                        </div>
                        <Link href="/" passHref>
                            <div className={styles.logoMobile}></div>
                        </Link>
                        {
                            isApiError ?
                                <>
                                    <div className={styles.logingroupMobile}>
                                        <Link href="/login" passHref>
                                            <div className={styles.loginBtn}>로그인</div>
                                        </Link>
                                        <span>|</span>
                                        <Link href="/signup" passHref>
                                            <div className={styles.loginBtn}>회원가입</div>
                                        </Link>
                                    </div>
                                    <div className={styles.mypageMobile}>
                                        <Link href="/mypage" passHref>
                                            <div className={styles.mypagebtnMoblie}>
                                            </div>
                                        </Link>
                                        <div className={styles.itemBoxMoblie}>
                                        </div>
                                    </div>
                                </> : role === "admin" ?
                                    <>
                                        <div className={styles.logingroupMobile}>
                                            <Link href="/admin" passHref>
                                                <div>
                                                    관리자
                                                </div>
                                            </Link>
                                            <span>|</span>
                                            <Link href="/api/logout" passHref>
                                                <div className={styles.loginbtn}>로그아웃</div>
                                            </Link>
                                        </div>
                                        <div className={styles.mypage}>
                                            <Link href="/mypage" passHref>
                                                <div className={styles.mypagebtnMoblie}>
                                                </div>
                                            </Link>
                                            <div className={styles.itemBoxMoblie}>
                                            </div>
                                        </div>
                                    </> :
                                    <>
                                        <div className={styles.logingroupMobile}>
                                            <Link href="/api/logout" passHref>
                                                <div className={styles.loginbtn}>로그아웃</div>
                                            </Link>
                                        </div>
                                        <div className={styles.mypage}>
                                            <Link href="/mypage" passHref>
                                                <div className={styles.mypagebtnMoblie}>
                                                </div>
                                            </Link>
                                            <div className={styles.itemBoxMoblie}>
                                            </div>
                                        </div>
                                    </>
                        }
                    </div>
                </div >
            </Moblie>
        </>

    )
}

export default HeaderCompo