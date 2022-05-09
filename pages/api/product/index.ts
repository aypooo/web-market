import AWS from "aws-sdk";
import mongoose from "mongoose";
import Product, { product } from "../../../models/Product";
import { Err, Ok, ValueNotFoundErr } from "../../../utils/server/commonError";
import { customHandler } from "../../../utils/server/commonHandler";
import { envExist } from "../../../utils/validateEnv";


async function sendByCategory(maxResults: number) {
    const categoryQuery = [{ "$group": { "_id": "category1", "categories": { "$addToSet": "$category1" } } }]
    const categories: String[] = (await Product.aggregate(categoryQuery).exec())[0]["categories"]
    const totalResult: product[] = []
    for (let category of categories) {
        const result = await Product.aggregate([{ "$match": { "category1": category } }, { "$sample": { "size": Math.floor(maxResults / categories.length) } }])
        totalResult.push(...result)
    }
    return totalResult
}

async function getUrlFromAWS(imageDataUrl: string) {
    AWS.config.update({
        accessKeyId: envExist(process.env.MY_AWS_ACCESS_KEY_ID, "aws access key id", true),
        secretAccessKey: envExist(process.env.MY_AWS_SECRET_ACCESS_KEY, "aws access key id", true),
        region: 'ap-northeast-2'
    });
    const s3bucket = new AWS.S3()
    const imagePart = imageDataUrl.split(",")
    const imageData = imagePart[1]
    const imageType = imagePart[0].split(":")[1].split(";")[0]
    const possibleTypes = ["image/png", "image/gif", "image/jpeg"]
    if (!possibleTypes.includes(imageType)) {
        throw new Error("not a valid extension")
    }
    const buffer = Buffer.from(imageData, "base64")
    const filename = new mongoose.Types.ObjectId().toString()
    const params = {
        Bucket: "web-market",
        Key: filename,
        Body: buffer,
        ACL: 'public-read',
        ContentType: imageType
    }
    const resultUrl = (await s3bucket.upload(params).promise()).Location
    return resultUrl
}

const handler = customHandler()
    .get(
        async (req, res) => {
            let { _id, keyword, category1, category2, byCategory, sort, display, pagenum } = req.query
            const maxResults = Math.min(100, parseInt(display ? display.toString() : "10"))
            if (byCategory === "true") {
                const totalResult = await sendByCategory(maxResults)
                Ok(res, totalResult)
            } else {
                const totalQuery: any = {
                    name: keyword && new RegExp(keyword.toString(), "i"),
                    _id: _id && _id.toString(),
                    category1: category1 || undefined,
                    category2: category2 || undefined
                }
                let sortQuery: string
                switch (sort) {
                    case "viewcount":
                        sortQuery = "-viewcount"
                        break
                    case "lowprice":
                        sortQuery = "price"
                        break
                    default:
                        sortQuery = "-price"
                }
                const parsedPagenum = pagenum ? parseInt(pagenum.toString()) : 1
                const result = await Product.find(totalQuery).sort(sortQuery).limit(parsedPagenum * maxResults).skip((parsedPagenum - 1) * maxResults)
                const totalnum = (await Product.find(totalQuery)).length
                Ok(res, { data: result, metadata: { totalnum } })
            }
        }
    )
    .post(
        async (req, res) => {
            const { name, price, category1, category2, category3, category4, imageDataUrl, thumbnailDataUrl, description, mallName, maker, brand } = req.body
            const imageUrl = await Promise.all(imageDataUrl.map(getUrlFromAWS))
            const thumbnailUrl = await Promise.all(thumbnailDataUrl.map(getUrlFromAWS))
            console.log(imageUrl, thumbnailUrl)
            const productData: product = { name, price, category1, category2, category3, category4, imageUrl, thumbnailUrl, description, mallName, maker, brand }
            await new Product(productData).save()
            return Ok(res, "success")
        }
    )
    .put(
        async (req, res) => {
            const { _id } = req.query
            const result = await Product.findOne({ _id })
            if (result) {
                const value = await new Product(req.body).save()
                Ok(res, value)
            } else {
                ValueNotFoundErr(res, "product_id not found")
            }
        }
    )
    .delete(
        async (req, res) => {
            Ok(res, "success")
        }
    )

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb' // Set desired value here
        }
    }
}


export default handler;