import { NextPage } from 'next'
import Link from 'next/link'
import { product } from '../../models/Product'
import CategoryListStyle from '../../styles/CategoryList.module.css'

const CategoryList: NextPage<{ data: product }> = ({ data }) => {
    return (
        <div>
            <div className={CategoryListStyle.content}>
                <Link href={`/product?_id=${data._id}`} passHref>
                    <div className={CategoryListStyle.tumbs}>
                        <img className={CategoryListStyle.image} src={data.thumbnailUrl[0]}></img>
                    </div>
                </Link>
                <div className={CategoryListStyle.itemInfo}>
                    <Link href={`/product?_id=${data._id}`} passHref>
                        <span className={CategoryListStyle.product_name}>{data.name}</span>
                    </Link>
                    <span>{data.category1} | {data.category2}</span>
                    <div className={CategoryListStyle.btn_group}>
                        <button className={CategoryListStyle.like_button}>찜하기</button>
                        <button className={CategoryListStyle.itembox_button}>장바구니</button>
                    </div>
                </div>
                <div className={CategoryListStyle.sideInfo}>
                    <div><strong>{data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</strong>원</div>
                    <span>무료배송</span>
                    <span>{data.maker}</span>
                </div>
            </div>
        </div >
    )
}

export default CategoryList