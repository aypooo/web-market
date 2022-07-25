import { body, cookie, query } from "express-validator";
import Inquiry, { inquiry } from "../../../models/Inquiry";
import User from "../../../models/User";
import { Err, Ok, ValueNotFoundErr } from "../../../utils/server/commonError";
import { customHandler, validate } from "../../../utils/server/commonHandler";
import { validateRequest } from "../../../utils/server/middleware";


const handler = customHandler()
    .get( //기능: 유저 qna info 불러오기, 입력: 없음, 출력:유저의 qna info
        async (req, res) => {
            const user_id = parseInt(req.cookies.user_id)
            console.log(user_id, req.cookies.user_id)
            const result = await Inquiry.find({ user_id })
            // .populate({ path: "user_id", model: User })
            return Ok(res, result)
        }
    )
    .post(//기능: 유저 qna 저장, 입력:user_id, qacategory, title, content, 출력:저장 결과
        validateRequest([
            body("qacategory").isIn(["교환", "환불", "배송", "상품문의", "주문취소", "주문/결제", "이벤트"]),
            body("title").exists(),
            body("content").exists()]),
        async (req, res) => {
            const user_id = parseInt(req.cookies.user_id)
            const { qacategory, title, content } = req.body
            const saveValue: inquiry = { user_id, qacategory, title, content, createdAt: new Date() }
            const result = await new Inquiry(saveValue).save()
            return Ok(res, result)
        }
    )
    .put(  //기능: 유저 qna 수정, 입력:_id, qacategory, title, content, user_id, 출력:수정 결과
        validateRequest([
            body("_id").isNumeric(),
            body("qacategory").isIn(["교환", "환불", "배송", "상품문의", "주문취소", "주문/결제", "이벤트"]),
            body("title").exists(),
            body("content").exists()]),
        async (req, res) => {
            const user_id = parseInt(req.cookies.user_id)
            const { _id, qacategory, title, content } = req.body
            const target: inquiry | null = await Inquiry.findOne({ user_id, _id })
            if (!target) {
                return ValueNotFoundErr(res, "inquiry not found")
            }
            const result = await Inquiry.updateOne({ user_id, _id }, { $set: { qacategory, title, content, createdAt: new Date() } })
            return Ok(res, result)
        }
    )
    .delete( //기능: 유저 qna 삭제, 입력:_id, 출력:삭제 결과
        async (req, res) => {
            const _id = parseInt(req.query._id.toString())
            const target: inquiry | null = await Inquiry.findOne({ _id })
            if (!target) {
                return Err(res, "inquiry not found")
            }
            await validate([cookie("user_id").equals(target.user_id.toString())])(req, res)
            const result = await Inquiry.deleteOne({ _id })
            return Ok(res, result)
        }
    )

export default handler;