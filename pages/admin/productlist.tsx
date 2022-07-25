import type { NextPage } from 'next'
import useCustomSWR from '../../utils/client/useCustumSWR'
import Layout from '../../component/Layout'
// import 'bootstrap/dist/css/bootstrap.css'
import adminStyle from '../../styles/admin/admin.module.css'
import Sidebar from '../../component/admin/Sidebar'
import { useRouter } from 'next/router'
import Loading from '../../component/Loading'
import { ChangeEventHandler, MouseEventHandler, useState } from 'react'
import customAxios from '../../utils/customAxios'
import productListStyle from '../../styles/admin/productlist.module.css'

const Productlist: NextPage = () => {
    const router = useRouter()
    const [inputs, setinputs] = useState({
        name: "",
        price: "",
        category1: "",
        category2: "",
    })
    const [thumbnailDataUrl, setThumbnailDataUrl] = useState([])
    const [imageDataUrl, setimageDataUrl] = useState([])
    const categorySWR = useCustomSWR("/api/product/category", {}, false, true)
    const { data, isLoading, isApiError, isServerError } = useCustomSWR("/api/user/me")
    if (isLoading) return <div><Loading /></div>
    if (isServerError) {
        alert("서버 에러가 발생하였습니다")
        router.push("/")
    }
    if (isApiError) {
        alert("로그인이 필요합니다")
        router.push("/login")
    }
    if (data.role != "admin") {
        alert("권한이 없습니다")
        router.push("/")
    }
    if (categorySWR.isLoading) {
        return <div><Loading /></div>
    }


    const { name, price, category1, category2 } = inputs
    const onChange = (e: any) => {
        const { name, value } = e.target
        const nextInputs = {
            ...inputs, [name]: value,
        }
        setinputs(nextInputs)
    }

    const savethumbDataUrl: ChangeEventHandler<HTMLInputElement> = e => {
        if (e.target.files) {
            const filesInArr = Array.from(e.target.files);
            const filesURL = []
            console.log(filesInArr)
            let file;
            let filesLength = filesInArr.length > 5 ? 5 : filesInArr.length
            if (thumbnailDataUrl.length + filesLength > 5) {
                alert("사진갯수는 5장을 초과할 수 없습니다.")
            } else {
                for (let i = 0; i < filesLength; i++) {
                    file = filesInArr[i];
                    let reader = new FileReader();
                    reader.onload = () => {
                        console.log(reader.result);
                        filesURL[i] = reader.result;
                        setThumbnailDataUrl(prevImages => prevImages.concat(reader.result));
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    }
    const saveImageDataUrl: ChangeEventHandler<HTMLInputElement> = e => {
        if (e.target.files) {
            const filesInArr = Array.from(e.target.files);
            const filesURL = []
            console.log(filesInArr)
            let file;
            let filesLength = filesInArr.length > 5 ? 5 : filesInArr.length
            if (imageDataUrl.length + filesLength > 5) {
                alert("사진갯수는 5장을 초과할 수 없습니다.")
            } else {
                for (let i = 0; i < filesLength; i++) {
                    file = filesInArr[i];
                    let reader = new FileReader();
                    reader.onload = () => {
                        console.log(reader.result);
                        filesURL[i] = reader.result;
                        setimageDataUrl(prevImages => prevImages.concat(reader.result));
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    }

    const categoryData = categorySWR.data
    const category1Data: Array<string> = []
    categoryData.forEach((category: any) => category1Data.push(category.category1));
    let category2Data: Array<string> = []
    category1 && categoryData.forEach((category: any) => {
        if (category.category1 === category1) {
            category2Data = category.category2
        }
    })
    /*  
    유저 필수 입력값: name, price, category1, category2
    유저 선택 입력값(필수로 수정 가능): category3, category4, description, mallName, maker, brand
    이 값들을 입력 받은 후
    /api/product로 post를 보내면 됨
    보내야할 값(전부 다 보내야하는 건 아님, 받을 수 있는 값에 가까움): name, price, category1, category2, category3, category4, imageDataUrl, description, mallName, maker, brand
    */
    const createProduct: MouseEventHandler<HTMLButtonElement> = async e => {
        try {
            const result = await customAxios.post("/api/product", { ...inputs, thumbnailDataUrl, imageDataUrl })
            if (result.status === 200) {
                alert("업로드 성공")
            } else {
                alert("업로드 실패")
            }
        } catch {
            alert("업로드 중 서버에 에러가 발생하였습니다")
        }
    }

    return (
        <Layout>
            <div className={adminStyle.body}>
                <div>
                    <Sidebar toggle="productlist"></Sidebar>
                </div>
                <div className={productListStyle.content}>
                    <h3 className={productListStyle.title}> 상품목록</h3>
                    <table>
                        <tbody>
                            <tr>
                                <th>카테고리</th>
                                <td>
                                    <div className={productListStyle.selectarea}>
                                        <select className={productListStyle.Inputtag} name="category1" value={category1} onChange={onChange}>
                                            <option value="">카테고리1</option>
                                            {category1Data && category1Data.map(category1 => <option value={category1} key={category1}>{category1}</option>)}
                                        </select>
                                        <select className={productListStyle.Inputtag} name="category2" value={category2} onChange={onChange}>
                                            <option value="">카테고리2</option>
                                            {category2Data && category2Data.map(category2 => <option value={category2} key={category2}>{category2}</option>)}
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>상품이름</th>
                                <td>
                                    <input className={productListStyle.Inputtag} name="name" value={name} onChange={onChange} placeholder='상품 이름'></input>
                                </td>
                            </tr>
                            <tr>
                                <th>상품가격</th>
                                <td>
                                    <input className={productListStyle.Inputtag} type="number" name="price" value={price} onChange={onChange} placeholder='상품 가격'></input>
                                </td>
                            </tr>
                            <tr>
                                <th>썸네일</th>
                                <td>
                                    <div className={productListStyle.filebox}>
                                        <ul>
                                            {thumbnailDataUrl && thumbnailDataUrl?.map((file, i) => <li key={i}><img src={file} alt="" /></li>)}
                                        </ul>
                                        <label >
                                            <input className={productListStyle.file_input} type="file" multiple accept="image/png, image/gif, image/jpeg" onChange={savethumbDataUrl} />
                                        </label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>제품사진</th>
                                <td>
                                    <div className={productListStyle.filebox}>
                                        <ul>
                                            {imageDataUrl && imageDataUrl?.map((file, i) => <li key={i}><img src={file} /></li>)}
                                        </ul>
                                        <label >
                                            <input className={productListStyle.file_input} type="file" multiple accept="image/png, image/gif, image/jpeg" onChange={saveImageDataUrl} />
                                        </label>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={productListStyle.btn_group}>
                        <button onClick={createProduct}>상품 등록</button>
                    </div>
                </div>
            </div >
        </Layout >
    )
}

export default Productlist