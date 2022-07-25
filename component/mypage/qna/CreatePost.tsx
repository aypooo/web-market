import { useForm, SubmitHandler } from "react-hook-form"
import customAxios from "../../../utils/customAxios"
import { useRouter } from "next/router"
import Link from "next/link"
import createpostStyle from "../../../styles/mypage/createpost.module.css"
import { inquiry } from "../../../models/Inquiry"

export default function CreatePost() {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, watch } = useForm<inquiry>({ mode: "onSubmit" })
    const onSubmit: SubmitHandler<inquiry> = async data => {
        // alert(JSON.stringify(data, null, 2))
        try {
            const res = await customAxios.post("/api/inquiry/me", data)
            if (res.status == 200) {
                router.push('/mypage/qna')
                alert('문의가 접수 되었습니다.')
            } else {
                alert('접수가 실패했습니다.')
            }
        } catch (err) {
            console.log(err)
            alert('접수에 실패했습니다.')
        }
    }
    // console.log(watch())
    // console.log(register)
    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <div className={createpostStyle.container}>
                <div className={createpostStyle.content}>
                    <div className={createpostStyle.tilte}>문의 작성</div>
                    <table>
                        <tbody>
                            <tr>
                                <th scope='col'>문의유형</th>
                                <td>
                                    <>
                                        <select {...register("qacategory", { required: true })}>
                                            <option value="">문의유형 선택</option>
                                            <option value="교환">교환</option>
                                            <option value="환불">환불</option>
                                            <option value="배송">배송</option>
                                            <option value="상품문의">상품문의</option>
                                            <option value="주문취소">주문취소</option>
                                            <option value="주문/결제">주문/결제</option>
                                            <option value="이벤트">이벤트</option>
                                        </select>
                                        {errors.qacategory && alert("문의 유형을 선택해주세요")}
                                    </>
                                </td>
                            </tr>
                            {/* <tr>
                                <th>주문번호</th>
                                <td>
                                    <input {...register("ordernumber", { required: true })} placeholder="주문번호를 조회해주세요." type="text" />
                                    {errors.ordernumber && alert("주문번호를 조회해주세요")}
                                    <button>주문조회</button>
                                </td>
                            </tr> */}
                            <tr>
                                <th scope='col'>제목</th>
                                <td>
                                    <>
                                        <input {...register("title", { required: true })} placeholder="제목을 입력해주세요." />
                                        {errors.title && alert("제목을 입력해주세요")}
                                    </>

                                </td>
                            </tr>
                            <tr>
                                <th scope='col'>문의내용</th>
                                <td>
                                    <>
                                        <textarea {...register("content", { required: true })} cols={50} rows={10} placeholder="내용을 입력해주세요." />
                                        {errors.content && alert("내용을 입력해주세요.")}
                                    </>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={createpostStyle.btn_group}>
                        <button type="submit">문의하기</button>
                        <Link href="/mypage/qna" passHref>
                            <button >뒤로가기</button>
                        </Link>
                    </div>
                </div>
            </div>
        </form >
    )
}