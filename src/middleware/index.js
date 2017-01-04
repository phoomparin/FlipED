import feathers from "feathers"
import hooks from "feathers-hooks"
// import rest from "feathers-rest"
import socketio from "feathers-socketio"
import sync from "feathers-sync"

import cors from "cors"
import helmet from "helmet"
import path from "path"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"

import logger from "../core/logger"
import socketHandler from "./socketHandler"
import serverRender from "./serverRender"
import errorHandler from "./errorHandler"
import basicLogger from "./basicLogger"

import {REDIS_URL} from "../config"
import {IS_PROD} from "../constants/util"

// const excludeAPI = new RegExp(`^\/(?!${API_NAMESPACE}).*`)

export default function index() {
  this.logger = logger

  this.use(feathers.static(path.join(__dirname, "public")))
  this.use(cors())
  this.use(bodyParser.json())
  this.use(bodyParser.urlencoded({extended: true}))
  this.use(helmet())
  this.use(cookieParser())

  this.configure(hooks())
  // this.configure(rest()) // REST in peace
  this.configure(socketio(socketHandler))

  if (IS_PROD) {
    // Feathers Sync Module
    this.configure(sync({
      db: REDIS_URL || "redis://localhost:6379"
    }))
  }

  this.use(basicLogger)
  this.use(serverRender)
  this.use(errorHandler)
}
