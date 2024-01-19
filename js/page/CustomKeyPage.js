
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View, ScrollView, Text, Alert} from 'react-native';
import Toast from 'react-native-easy-toast';
import {connect} from 'react-redux';
import actions from '../redux/action';
import BackPressComponent from '../common/BackPressComponent';
import CheckBox from 'react-native-check-box';

import { 
  createMaterialTopTabNavigator, 
  createAppContainer
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import FavoriteUtil from '../util/FavoriteUtil';

import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArrayUtil from '../util/ArrayUtil';

// 
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';

type Props = {};

@connect(
  state=>state,
  {
    onLoadLanguage: actions.onLoadLanguage
  }
)
export default class CustomKeyPage extends Component<Props> {
  constructor (props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    this.changeValues = [];
    this.isRemoveKey = !!this.params.isRemoveKey;
    this.languageDao = new LanguageDao(this.params.flag);
    this.state = {
      keys: []
    }
  }
  componentDidMount() {
    // 注册物理返回键的监听
    this.backPress.componentDidMount();
    // 如果props中标签为空，则从本地存储中获取标签
    if (CustomKeyPage._keys(this.props).length === 0) {
      let {onLoadLanguage} = this.props;
      onLoadLanguage(this.params.flag);
    }
    this.setState({
      keys: CustomKeyPage._keys(this.props)
    })
  }
  componentWillUnmount() {
    // 注销物理返回键的监听
    this.backPress.componentWillUnmount();
  }
  onBackPress = () => {
    this.onBack();
    return true;
  }
  onBack () {
    if (this.changeValues.length > 0) {
      Alert.alert('提示','要保存修改吗', [
        {
          text: '否', onPress: () => {
            NavigationUtil.goBack({navigation:this.props.navigation});
          }
        },
        {
          text: '是', onPress: () => {
            this.onSave();
          }
        }
      ])
    } else {
      NavigationUtil.goBack({navigation:this.props.navigation});
    }
  }
  static _keys (props, original, state) {
    const {flag, isRemoveKey} = props.navigation.state.params;
    let key = flag === FLAG_LANGUAGE.flag_key?'keys':'languages';
    if (isRemoveKey&&!original) {
      // 如果state中的keys为空则从props中获取
      return state && state.keys && state.keys.length !== 0 && state.keys || props.language[key].map(val => {
        // 注意不直接修改props，copy一份
        return {
          ...val,
          checked: false
        };
      });
    } else {
      return props.language[key];
    }
  }
  static getDerivedStateFromProps (nextProps, prevState) {
    if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
      return {
        keys: CustomKeyPage._keys(nextProps, null, prevState)
      }
    }
    return null;
  }
  onSave () {
    if (this.changeValues.length === 0) {
      NavigationUtil.goBack({navigation:this.props.navigation});
      return;
    }
    let keys;
    // 移除标签特殊处理
    if (this.isRemoveKey) {
      for (let i = 0, l = this.changeValues.length; i < l; i++) {
        ArrayUtil.remove(keys = CustomKeyPage._keys(this.props, true), this.changeValues[i], 'name');
      }
    }
    // 更新本地数据
    this.languageDao.save(keys || this.state.keys);
    const {onLoadLanguage} = this.props;
    // 更新store
    onLoadLanguage(this.params.flag);
    NavigationUtil.goBack({navigation:this.props.navigation});
  }
  renderView () {
    let dataArray = this.state.keys;
    if (!dataArray || dataArray.length === 0) return;
    let len = dataArray.length;
    let views = [];
    for (let i = 0, l = len; i < l; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(dataArray[i], i)}
            {i+1 < len && this.renderCheckBox(dataArray[i+1], i+1)}
          </View>
          <View style={styles.line} />
        </View>
      )
    }
    return views;
  }
  onClick (data, index) {
    data.checked = !data.checked;
    ArrayUtil.updateArray(this.changeValues, data);
    let tempkeys = this.state.keys;
    tempkeys[index] = data;
    this.setState({
      keys: tempkeys
    })
  }
  _checkedImage (checked) {
    const {theme} = this.params;
    return <Ionicons 
      name={checked?'ios-checkbox':'md-square-outline'}
      size={20}
      style={{
        color: theme.themeColor
      }}
    />
  }
  renderCheckBox (data, index) {
    return <CheckBox
      style={{flex: 1, padding: 10}}
      onClick={()=> this.onClick(data, index)}
      isChecked={data.checked}
      leftText={data.name}
      checkedImage={this._checkedImage(true)}
      unCheckedImage={this._checkedImage(false)}
    />
  }
  render() {
    let title = this.isRemoveKey?'标签移除': '自定义标签';
    title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言': title;
    let rightButtonTitle = this.isRemoveKey?'移除':'保存';
    // 顶部导航栏设置
    const {theme} = this.params;
    let navigationBar = <NavigationBar
      title={title}
      style={{backgroundColor: theme.themeColor}}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
      rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
    />
    return <View style={styles.container}>
      {navigationBar}
      <ScrollView>
        {this.renderView()}
      </ScrollView>
    </View>
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  item: {
    flexDirection: 'row',
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray'
  }
});
