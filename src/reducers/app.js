import {createReducer} from "../core/helper"

export default createReducer({fields: {}, ui: {}}, state => ({
  SET_FIELD: ({field, value}) => ({
    ...state,
    fields: {...state.fields, [field]: value}
  }),
  SET_SNACKBAR: text => ({
    ...state,
    snackbar: text
  }),
  SET_UI_STATE: ({key, value}) => ({
    ...state,
    ui: {...state.ui, [key]: value}
  }),
  TOGGLE_UI_STATE: key => ({
    ...state,
    ui: {...state.ui, [key]: !state.ui[key]}
  }),
  SET_TEMP_STATE: ({key, value}) => ({
    ...state,
    temp: {...state.temp, [key]: value}
  })
}))
