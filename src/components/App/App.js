import React, {Component, PropTypes} from "react"
import {Provider as StoreProvider} from "react-redux"
import {AppContainer} from "react-hot-loader"

import ThemeProvider from "material-ui/styles/MuiThemeProvider"
import getMuiTheme from "material-ui/styles/getMuiTheme"

import {blue100, blue500, blue700} from "material-ui/styles/colors"

import app from "../../client/api"
import {DEFAULT_UA} from "../../constants"
import browserHistory from "../../core/history"

import {setUserInfo} from "../../actions/user"
import {autoSyncAll} from "../../core/sync"

const empty = () => {}

import s from "./App.scss"

export default class App extends Component {

  static propTypes = {
    context: PropTypes.shape({
      store: PropTypes.object.isRequired,
      insertCss: PropTypes.func,
      setTitle: PropTypes.func,
      setMeta: PropTypes.func
    }),
    children: PropTypes.element.isRequired,
    error: PropTypes.object
  }

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    setMeta: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.muiTheme = getMuiTheme({
      palette: {
        primary1Color: blue500,
        primary2Color: blue700,
        primary3Color: blue100,
      },
    }, {
      avatar: {borderColor: null},
      userAgent: props.context.store.getState().runtime.userAgent || DEFAULT_UA,
      fontFamily: "Roboto, Kanit"
    })
  }

  getChildContext = () => ({
    insertCss: this.props.context.insertCss || empty,
    setTitle: this.props.context.setTitle || empty,
    setMeta: this.props.context.setMeta || empty,
  })

  componentWillMount = () => {
    const {insertCss, store} = this.props.context
    this.removeCss = insertCss(s)
    autoSyncAll(store.dispatch)
    app.service("users").on("patched", e => {
      // Update user state on incoming events.
      if (store.getState().user._id === e._id) {
        store.dispatch(setUserInfo(e))
      }
    })
    browserHistory.listen(location => {
      console.log("LOCATION_CHANGE", location)
    })
  }

  componentWillUnmount = () => {
    this.removeCss()
    app.service("users").off("patched")
  }

  render = () => (this.props.error ? this.props.children : (
    <AppContainer>
      <ThemeProvider muiTheme={this.muiTheme}>
        <StoreProvider store={this.props.context.store}>
          {this.props.children}
        </StoreProvider>
      </ThemeProvider>
    </AppContainer>
  ))

}
