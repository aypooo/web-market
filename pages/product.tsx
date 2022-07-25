import styles from '../styles/product.module.css'
import { useState, useRef } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import customAxios from '../utils/customAxios'
import { useRouter } from 'next/router'
import useCustomSWR from '../utils/client/useCustumSWR'
import Layout from '../component/Layout'
import Link from 'next/link'
import img1 from "/public/img/상품상세정보.jpg"
import img2 from "/public/img/상품후기.jpg"
import img3 from "/public/img/상품문의.jpg"
import img4 from "/public/img/반품교환정보.jpg"
import Image from 'next/image'
export const getServerSideProps: GetServerSideProps = async (context) => {
    const res = await customAxios.get(`/api/product?_id=${context.query._id}`)
    await customAxios.patch("/api/product/viewcount", { _id: context.query._id })
    const { data: { result } } = res
    console.log(result.data[0])
    return {
        props: { ...result.data[0] }
    }
}


function Before(props: any) {
    return (
        <div className={styles.before}></div>
    )
}

function Before2(props: any) {
    return (
        <div className={styles.before2}></div>
    )
}



const Product: NextPage = (props: any) => {
    const router = useRouter()
    const { query } = router
    const params = new URLSearchParams();
    ["likelist", "cartlist"].forEach(value => params.append("required", value))
    const { data, isLoading, isApiError, isServerError } = useCustomSWR("/api/user/me", { params }, true)
    const [count, setCount] = useState(0)
    const [index, setIndex] = useState('')
    const myRef1 = useRef(null)
    const myRef2 = useRef(null)
    const myRef3 = useRef(null)
    const myRef4 = useRef(null)
    if (isLoading || !props) return <div>로딩중...</div>
    if (isServerError) {
        alert("서버 에러가 발생하였습니다")
        router.push("/")
    }
    console.log(data)
    const { likelist, cartlist } = data || {}
    const onIncrease = () => setCount(count + 1)
    const onDecrease = () => setCount(count - 1)
    const SumPrice = () => count * parseInt(props.price)
    const pressLike = async () => {
        if (isApiError) {
            alert("로그인이 필요합니다")
            router.push("/login")
        } else {
            if (!likelist.includes(props._id)) {
                likelist.push(props._id)
            } else {
                likelist.splice(likelist.indexOf(props._id), 1)
            }
            await customAxios.patch("/api/user/me", { likelist })
        }
    }
    const pressCart = async () => {
        if (isApiError) {
            alert("로그인이 필요합니다")
            router.push("/login")
        } else {
            if (!cartlist.includes(props._id)) {
                cartlist.push(props._id)
                await customAxios.patch("/api/user/me", { cartlist })
                alert("장바구니에 추가되었습니다")
            } else {
                alert("이미 장바구니에 추가되어있습니다")
                router.push(`/mypage/cartlist`)
            }
        }
    }

    const pressPayment = async () => {
        if (isApiError) {
            alert("로그인이 필요합니다")
            router.push("/login")
        } else {
            console.log(cartlist)
            if (!cartlist.includes(props._id)) {
                cartlist.push(props._id)
            }
            await customAxios.patch("/api/user/me", { cartlist })
            router.push(`/payment`)
        }
    }

    const tagSelect = (e) => {
        switch (e.target.tabIndex) {
            case 0:
                myRef1.current.scrollIntoView({ "behavior": "smooth" })
                break;
            case 1:
                myRef2.current.scrollIntoView({ "behavior": "smooth" })
                break;
            case 2:
                myRef3.current.scrollIntoView({ "behavior": "smooth" })
                break;
            case 3:
                myRef4.current.scrollIntoView({ "behavior": "smooth" })
                break;
        }
    }
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.purchaseList}>
                    <div className={styles.turmb}>
                        <img className={styles.itemImage} src={props.thumbnailUrl[0]}></img>
                    </div>
                    <div className={styles.purchasePart}>
                        <div>
                            <div className={styles.itemName}>{props.name}</div>
                            <div className={styles.price}>{props.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</div>
                        </div>

                        <div className={styles.delivery}>
                            <p><strong>오늘출발 상품</strong></p>
                            <p>오늘 13:00시까지 결제 시, 오늘 바로 발송됩니다.</p>
                        </div>
                        <div className={styles.express}>
                            배송비
                            <span>무료배송</span>
                        </div>

                        <div className={styles.totalPrice}>
                            <strong>총 상품금액</strong>
                            {/* <div className={styles.countName}>수량</div> */}
                            <div className={styles.total}>
                                <div className={styles.countBut}>
                                    <button disabled={count === 0 ? true : false} onClick={onDecrease} className={styles.count}></button>
                                    <div className={styles.count}>{count}</div>
                                    <button onClick={onIncrease} className={styles.count}></button>
                                </div>
                                <div className={styles.orderPrice}>
                                    합계 <span>{SumPrice().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.btn_group}>
                            <Link href={`/payment?_id=${query._id}`} passHref>
                                <button className={styles.purchaseButton} onClick={pressPayment}>구매하기</button>
                            </Link>
                            {/* 찜하기 */}
                            <button className={styles.likebox} onClick={pressLike}></button>
                            {/* 장바구니 */}
                            <button className={styles.itembox} onClick={pressCart}></button>
                        </div>
                    </div>
                </div>

                {/* ------------------------------상품설명----------------------------------- */}

                <div className={styles.itemTag}>
                    <div className={styles.tagLayout} role='tablist'>
                        <ul>
                            <li>
                                <div onClick={tagSelect} role='tab' tabIndex={0} id='tagInfo' className={styles.tag}  >
                                    <span onClick={tagSelect} role='tab' tabIndex={0} id='tagInfo'>상세정보</span>
                                </div>
                            </li>
                            <li>
                                <div onClick={tagSelect} role='tab' tabIndex={1} id='tagReview' className={styles.tag}>
                                    <span onClick={tagSelect} role='tab' tabIndex={1} id='tagReview' >상품후기</span>
                                </div>
                            </li>
                            <li>
                                <div onClick={tagSelect} role='tab' tabIndex={2} id='tagReview' className={styles.tag}>
                                    <span onClick={tagSelect} role='tab' tabIndex={2} id='tagReview'>상푼문의</span>
                                </div>
                            </li>
                            <li  >
                                <div onClick={tagSelect} role='tab' tabIndex={3} id='tagReview' className={styles.tag}>
                                    <span onClick={tagSelect} role='tab' tabIndex={3} id='tagReview' >반품/교환정보</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.tagList}>
                        <div className={styles.tagInfo} tabIndex={0} ref={myRef1}>
                            <Image
                                src={img1}></Image>
                        </div>
                        <div className={styles.tagInfo} tabIndex={1} ref={myRef2}>
                            <Image
                                src={img2}></Image>
                        </div>
                        <div className={styles.tagInfo} tabIndex={2} ref={myRef3}>
                            <Image
                                src={img3}></Image>
                        </div>
                        <div className={styles.tagInfo} tabIndex={3} ref={myRef4}>
                            <Image
                                src={img4}></Image>
                        </div>
                    </div>

                </div>
            </div>
        </Layout >
    )
}
export default Product