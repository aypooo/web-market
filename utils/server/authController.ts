import { cookie, query, ValidationChain, validationResult } from "express-validator"
import { NextApiRequest, NextApiResponse } from "next"
import { NextHandler } from "next-connect"
import { serverAuth, saveLog, validate } from "./middleware"

// interface authCondition {
//     path: string,
//     detail?: (string | { method: string, query?: string[], body?: string[] })[] // GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH
// }

interface authCondition {
    path: string | RegExp,
    detail?: (string | { method: string, validate?: ValidationChain[] })[] // GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH
}

const ADMINCONDITION: Array<authCondition> = [
    // { path: "/api/admin/userlist" },
    { path: "/api/user$", detail: [{ method: "GET", validate: [query("required").exists()] }, "PATCH", "DELETE"] },
    { path: "/api/product$", detail: ["POST", "PUT", "DELETE"] },
    { path: "/api/inquiry$" }
]
const USERCONDITION: Array<authCondition> = [
    { path: "/api/user/me$" },
    { path: "/api/inquiry/me$" }

]

async function checkAuth(conditions: authCondition[], req: NextApiRequest) {
    const path = new URL(req.url, `http://${req.headers.host}`).pathname
    for (let condition of conditions) {
        if (path.match(condition.path)) {
            if (condition.detail) {
                for (let detail of condition.detail) {
                    if (typeof detail === "string") {
                        if (req.method.toUpperCase() === detail.toUpperCase()) {
                            return true
                        }
                    } else {
                        if (detail.validate) {
                            for (let validation of detail.validate) {
                                if ((await validation.run(req, { dryRun: true })).isEmpty()) {
                                    return true
                                }
                            }
                        }
                    }
                }
            } else {
                return true
            }
        }
    }
    return false
}


export default async function authController(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
    if (await checkAuth(ADMINCONDITION, req)) {
        await serverAuth(req, res)
        await saveLog(req, res)
        await validate([cookie("role").equals("admin")])(req, res)
    } else if (await checkAuth(USERCONDITION, req)) {
        await serverAuth(req, res)
        await saveLog(req, res)
    } else {
        await saveLog(req, res)
    }
    next()
}