import React from "react"
import withStyles from "isomorphic-style-loader/lib/withStyles"

import Image from "react-medium-image-zoom"
import TextField from "material-ui/TextField"

import Grid from "../Grid"
import Upload from "../Upload"

import s from "./ContentEditor.scss"

import {IS_CLIENT} from "../../constants/util"

const Quill = IS_CLIENT ? require("react-quill") : () => <div />

const getYouTubeID = url => {
  const videoId = url.split("v=")[1]
  if (videoId) {
    const ampersandPosition = videoId.indexOf("&")
    if (ampersandPosition !== -1) {
      return videoId.substring(0, ampersandPosition)
    }
    return videoId
  }
  return url
}

const ContentEditor = props => ({
  card: (
    <Quill
      value={props.content}
      onChange={v => props.set("content", v)}
      theme="bubble"
    />
  ),
  youtube: (
    <div>
      <div className={s.ytContainer}>
        <iframe
          src={`https://www.youtube.com/embed/${props.src}`}
          className={s.youtube}
          frameBorder="0"
          allowFullScreen
        />
      </div>
      <div style={{padding: "0em 2em 0.5em 2em"}}>
        <TextField
          style={{width: "100%"}}
          floatingLabelText="กรุณาวางลิงค์ของวิดิโอ YouTube"
          value={props.src}
          onChange={v => props.set("src", getYouTubeID(v.target.value))}
        />
      </div>
    </div>
  ),
  image: (
    <div>
      <Upload
        style={{position: "absolute", right: "17%"}}
        result={id => props.set("src", `/uploads/${id}`)}
      />
      <Image
        image={{
          src: props.src,
          alt: props.alt,
          className: s.image
        }}
        zoomImage={{
          src: props.src,
          alt: props.alt
        }}
      />
    </div>
  ),
  cover: (
    <div>
      <Upload
        style={{position: "absolute", right: "10%"}}
        result={id => props.set("src", `/uploads/${id}`)}
      />
      <div
        style={{backgroundImage: `url(${props.src})`}}
        className={s.cover}
      />
    </div>
  ),
  quiz: (
    <div>...</div>
  ),
  embed: (
    <iframe
      src={props.src}
      style={{width: "100%", height: "100%"}}
      scrolling="no"
      frameBorder="0"
    />
  )
}[props.type] || <div />)

export default withStyles(s)(ContentEditor)
