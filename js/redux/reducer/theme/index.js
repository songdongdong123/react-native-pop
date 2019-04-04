import Types from '../../action/action_types';
import ThemeFactory, {ThemeFlags} from '../../../res/styles/ThemeFactory';
console.log(ThemeFactory.createTheme(ThemeFlags.Default))
const defaultState = {
  theme: ThemeFactory.createTheme(ThemeFlags.Default),
  customThemeViewVisible: false
}
export default function onAction (state=defaultState, action) {
  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        ...state,
        theme: action.theme
      }
    case Types.SHOW_THEME_VIEW:
      return {
        ...state,
        customThemeViewVisible: action.customThemeViewVisible
      }
    default:
      return state
  }
}