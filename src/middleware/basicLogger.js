import decode from "../core/decodeJwt"

import {NO_JWT, NO_COOKIE, INVALID_JWT} from "../constants"

export default function basicLogger(req, res, next) {
  // req.cookies
  const log = `Incoming Request from ${req.ip}`
  req.app.logger.log("debug", log)
  next()
}
