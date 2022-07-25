import Product from '../../../models/Product';
import User from '../../../models/User';
import { encryptPassword } from '../../../utils/encrypt';
import { Err, Ok } from '../../../utils/server/commonError';
import { customHandler } from '../../../utils/server/commonHandler';
import { filterObject, flattenObject } from '../../../utils/server/etc';


const handler = customHandler()
    .get( // 입력: 없음, 출력: 해당 유저의 모든 정보
        async (req, res) => {
            let { user_id } = req.cookies
            let { required } = req.query
            const result = await User.findOne({ _id: user_id })
                .populate({ path: "likelist", model: Product })
                .populate({ path: "cartlist", model: Product })
                .lean()
            if (!result) {
                return Err(res, "misterious error with token")
            } else {
                let filter: string[]
                if (!required) {
                    filter = ["role", "_id"]
                } else if (typeof required === "string") {
                    filter = ["role", "_id", required]
                } else {
                    filter = ["role", "_id", ...required]
                }
                const filteredResult = filterObject(flattenObject(result), filter)
                return Ok(res, filteredResult)
            }
        })
    .patch( // 입력: 해당 유저의 수정 정보(fulladdress, password의 경우 oldpassword까지), 출력: 성공 여부
        async (req, res) => {
            const { user_id } = req.cookies
            let { fulladdress, password, oldpassword, cartlist, likelist } = req.body
            const result = await User.findOne({ _id: user_id })
            if (!result) {
                return Err(res, "userid not exist")
            }
            if (oldpassword || password) {
                if (encryptPassword(oldpassword) !== result.password) {
                    return Err(res, "password not matched")
                }
            }
            password = password && encryptPassword(password)
            result.fulladdress = fulladdress || result.fulladdress
            result.password = password || result.password
            result.cartlist = cartlist || result.cartlist
            result.likelist = likelist || result.likelist
            await result.save()
            return Ok(res, "success")
        })
export default handler