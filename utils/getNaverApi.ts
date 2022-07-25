import axios from "axios"
import Product, { product } from "../models/Product"

type naverShopping = {
    title: string,
    link: string,
    image: string,
    lprice: string,
    hprice: string,
    mallName: string,
    productId: string,
    productType: string,
    brand: string,
    maker: string,
    category1: string,
    category2: string,
    category3: string,
    category4: string
}

export async function insertDataByCategory() {
    const category = ["식품", "패션의류", "디지털/가전", "출산/육아", "생활/건강", "가구/인테리어", "도서", "화장품/미용", "여가/생활편의"]
    try {
        for (let targetCategory of category) {
            for (let start = 1; start <= 1000; start += 100) {
                console.log(targetCategory, start)
                const result: naverShopping[] = (await getNaverApi(targetCategory, start))["items"]
                for (let data of result) {
                    const { title, image, lprice, mallName, brand, maker, category1, category2, category3, category4 } = data
                    const name = title.replaceAll(/<b>/ig, "").replaceAll(/<\/b>/ig, "").replaceAll(/＆amp;/ig, "")
                    const product_data: product = { name, price: parseInt(lprice), category1, category2, category3, category4, imageUrl: [], mallName, brand, maker, thumbnailUrl: [image] }
                    await new Product(product_data).save()
                }
            }
        }
    } catch (error) { console.log(error) }
}

export default async function getNaverApi(keyword: string, start: number) {
    return (await axios.get(`https://openapi.naver.com/v1/search/shop.json?query=${encodeURI(keyword)}&display=100&start=${start}`, {
        headers: {
            "X-Naver-Client-Id": process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!,
            "X-Naver-Client-Secret": process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET!
        }
    })).data
} 