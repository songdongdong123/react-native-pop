import React, {Component} from 'react';
import { View, StatusBar, Linking } from 'react-native';
import { MORE_MENU } from  '../../common/MORE_MENU';
import GobalStyles from '../../res/styles/GobalStyles';
import ViewUtil from '../../util/ViewUtil';
import NavigationUtil from '../../navigator/NavigationUtil';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import config from '../../res/data/github_app_config.json';

const THEME_COLOR = '#f33'
type Props = {};
export default class AboutPage extends Component<Props> {
  constructor (props) {
    super(props);
    this.params = this.props.navigation.state.params;
    // debugger
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about,
    }, data => this.setState({...data}))
    this.state = {
      data: config
    }
  }
  onClick (menu) {
    let RouteName, params = {};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = '教程';
        params.url = 'https://ml.66jingcai.cn/'
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage';
        break;
      case MORE_MENU.Feedback:
        const url = "qqmail://172529131@qq.com"
        Linking.canOpenURL(url).then(support => {
          if (!support) {
            console.log('Can\'t handle url:' + url);
          } else {
            Linking.openURL(url);
          }
        }).catch(e => {
          console.error('An eooro occurred' + e);
        });
        break;
      default:
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName);
    }
  }
  getItem (menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
  }
  render() {
    const content = <View>
      {/* 教程 */}
      {this.getItem(MORE_MENU.Tutorial)}
      <View style={GobalStyles.line}/>
      {/* 关于作者 */}
      {this.getItem(MORE_MENU.About_Author)}
      <View style={GobalStyles.line}/>
      {/* 反馈 */}
      {this.getItem(MORE_MENU.Feedback)}
    </View>
    return this.aboutCommon.render(content, this.state.data.app);
  }
}
