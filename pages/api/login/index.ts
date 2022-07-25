import User from "../../../models/User"
import { body, query } from 'express-validator';
import { customHandler } from '../../../utils/server/commonHandler';
import { Err, Ok } from "../../../utils/server/commonError";
import { createJWT, encryptPassword, uuid4, verifyJWT } from "../../../utils/encrypt";
import { validateRequest } from "../../../utils/server/middleware";
import LoginToken, { loginToken } from "../../../models/LoginToken";

export interface loginQuery {
    id: string,
    password: string,
    fingerprint: string,
    persistent: boolean
}

const handler = customHandler()
    .post(
        validateRequest([
            body(["id", "password", "fingerprint"]).exists(),// fingerprint required
            body("persistent").isBoolean()
        ]),
        async (req, res) => {
            let { id, password, fingerprint, persistent } = req.body
            const ip = (req.headers["x-real-ip"] || "0.0.0.0").toString()
            password = encryptPassword(password)
            const result = await User.findOne({ id, password })
            if (!result) {
                return Err(res, "not a valid id or password")
            }
            const { role } = result
            const access_jti = uuid4()
            const refresh_jti = uuid4()
            const consistDate = persistent ? 14 : 1
            const expirationtime = consistDate.toString() + "d"
            let expireAt = new Date()
            expireAt.setDate(expireAt.getDate() + consistDate)
            const user_id = (await User.findOne({ id }))._id
            if (!user_id) {
                return Err(res, "id not found")
            }
            const loginToken: loginToken = { user_id, jti: refresh_jti, fingerprint, ip, expireAt }
            const access_token = await createJWT(user_id.toString(), role, access_jti, "30m")
            const refresh_token = await createJWT(user_id.toString(), role, refresh_jti, expirationtime)
            const cookies = [`access_token=${access_token};Max-Age=${30 * 60};Path=/;HttpOnly;Secure;SameSite=Strict`,
            `refresh_token=${refresh_token};Max-Age=${consistDate * 24 * 60 * 60};Path=/;HttpOnly;Secure;SameSite=Strict`]
            res.setHeader('Set-Cookie', cookies)
            await new LoginToken(loginToken).save()
            Ok(res, role)
        }
    )
    .delete(
        async (req, res) => {
            const cookies = [`access_token=;Max-Age=-1;Path=/;HttpOnly;Secure;SameSite=Strict`,
                `refresh_token=;Max-Age=-1;Path=/;HttpOnly;Secure;SameSite=Strict`]
            res.setHeader('Set-Cookie', cookies)
            const { refresh_token } = req.cookies
            if (refresh_token) {
                try {
                    const { jti } = await verifyJWT(refresh_token)
                    await LoginToken.deleteOne({ jti })
                    Ok(res, "logout successful")
                } catch (error) {
                    Err(res, "logout failed", error)
                }
            } else {
                Ok(res, "not logged in yet")
            }
        }
    )

export default handler