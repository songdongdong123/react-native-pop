import React, {Component} from 'react';
import { View, StatusBar, Linking, Clipboard } from 'react-native';
import { MORE_MENU } from  '../../common/MORE_MENU';
import GobalStyles from '../../res/styles/GobalStyles';
import ViewUtil from '../../util/ViewUtil';
import NavigationUtil from '../../navigator/NavigationUtil';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import config from '../../res/data/github_app_config.json';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-easy-toast';

const THEME_COLOR = '#f33';
type Props = {};
export default class AboutMePage extends Component<Props> {
  constructor (props) {
    super(props);
    this.params = this.props.navigation.state.params;
    // debugger
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about_me,
    }, data => this.setState({...data}))
    this.state = {
      data: config,
      showTutorial: true,
      showBlog: false,
      showQQ: false,
      showContact: false
    }
  }
  onClick (tab) {
    if (!tab) return;
    if (tab.url) {
      NavigationUtil.goPage({
        title: tab.title,
        url: tab.url
      }, 'WebViewPage')
      return;
    }
    if (tab.account&&tab.account.indexOf('@')>-1) {
      let url = 'qqmail://' + tab.account;
      Linking.canOpenURL(url).then(support => {
        if (!support) {
          console.log('Can\'t handle url:' + url);
        } else {
          Linking.openURL(url);
        }
      }).catch(e => {
        console.error('An eooro occurred' + e);
      });
      return;
    }
    if (tab.account) {
      Clipboard.setString(tab.account);
     this.toast.show(tab.title + tab.account + '已复制到剪贴板。');
    }
  }
  getItem (menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
  }
  _item (data, isShow, key) {
    // console.log(this.state.data)
    // debugger
    return ViewUtil.getSettingItem(() => {
      // 该箭头函数为，传递给getSettingItem中TouchableOpacity组件的onPress回调函数，
      this.setState({
        [key]: !this.state[key]
      })
    }, data.name, THEME_COLOR, Ionicons, data.icon, isShow?'ios-arrow-up': 'ios-arrow-down')
  }
  renderItems (dic, isShowAccount) {
    if (!dic) return null;
    let views = [];
    for (let i in dic) {
      let title = isShowAccount ? dic[i].title + ':' + dic[i].account : dic[i].title;
      views.push(
        <View key={i}>
          {
            ViewUtil.getSettingItem(()=> this.onClick(dic[i]), title, THEME_COLOR)
          }
          <View style={GobalStyles.line}/>
        </View>
      )
    }
    return views;
  }
  render() {
    const content = <View>
      {this._item(this.state.data.aboutMe.Tutorial, this.state.showTutorial, 'showTutorial')}
      <View style={GobalStyles.line}/>
      {this.state.showTutorial?this.renderItems(this.state.data.aboutMe.Tutorial.items):null}

      {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
      <View style={GobalStyles.line}/>
      {this.state.showBlog?this.renderItems(this.state.data.aboutMe.Blog.items):null}

      {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
      <View style={GobalStyles.line}/>
      {this.state.showQQ?this.renderItems(this.state.data.aboutMe.QQ.items):null}

      {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
      <View style={GobalStyles.line}/>
      {this.state.showContact?this.renderItems(this.state.data.aboutMe.Contact.items):null}

    </View>
    return <View style={{flex: 1}}>
      {this.aboutCommon.render(content, this.state.data.author)}
      <Toast ref={toast => this.toast=toast} 
          position={'center'}
        />
      </View>
  }
}
