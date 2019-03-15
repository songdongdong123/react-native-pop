import Types from '../../action/action_types';

const defaultState = {
  theme: '#f33'
}
export default function onAction (state=defaultState, action) {
  switch (action.type) {
    case Types.THEME_CHANGE:
      return {...state, theme:action.theme};
    default:
      return state;
  }
}