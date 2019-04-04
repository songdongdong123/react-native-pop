
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, TouchableHighlight, Alert} from 'react-native';
import {connect} from 'react-redux';
import actions from '../redux/action';
import BackPressComponent from '../common/BackPressComponent';
import SortableListView from 'react-native-sortable-listview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { 
  createMaterialTopTabNavigator, 
  createAppContainer
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';

import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArrayUtil from '../util/ArrayUtil';

// 
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
const THEME_COLOR='#f33';

type Props = {};

@connect(
  state=>state,
  {
    onLoadLanguage: actions.onLoadLanguage
  }
)
export default class SortKeyPage extends Component<Props> {
  constructor (props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    this.languageDao = new LanguageDao(this.params.flag);
    this.state = {
      checkedArray: SortKeyPage._keys(this.props)
    }
  }
  onBackPress = () => {
    this.onBack();
    return true;
  }
  onBack () {
    if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
      Alert.alert('提示', '要保存修改吗？',
        [
          {
            text: '否', onPress: () => {
              NavigationUtil.goBack({navigation:this.props.navigation})
            }
          }, {
          text: '是', onPress: () => {
            this.onSave(true)
          }
        }
        ])
    } else {
      NavigationUtil.goBack({navigation:this.props.navigation})
    }
  }
  static _keys (props, state) {
    //如果state中有checkedArray则使用state中的checkedArray
    // debugger
    if (state && state.checkedArray && state.checkedArray.length) {
      return state.checkedArray;
    }
    //否则从原始数据中获取checkedArray
    const flag = SortKeyPage._flag(props);
    let dataArray = props.language[flag] || [];
    let keys = [];
    for (let i = 0, j = dataArray.length; i < j; i++) {
      let data = dataArray[i];
      if (data.checked) keys.push(data);
    }
    return keys;
  }
  static _flag (props) {
    const { flag } = props.navigation.state.params;
    return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
  }
  static getDerivedStateFromProps (nextProps, prevState) {
    const checkedArray = SortKeyPage._keys(nextProps, null, prevState)
    if (prevState.keys !== checkedArray) {
      return {
        keys: checkedArray
      }
    }
    return null;
  }
  componentDidMount() {
    // 注册物理返回键的监听
    this.backPress.componentDidMount();
    // 如果props中标签为空，则从本地存储中获取标签
    if (SortKeyPage._keys(this.props).length === 0) {
      let {onLoadLanguage} = this.props;
      onLoadLanguage(this.params.flag);
    }
  }
  componentWillUnmount() {
    // 注销物理返回键的监听
    this.backPress.componentWillUnmount();
  }
  onSave (hasChecked) {
    if (!hasChecked) {
      //如果没有排序则直接返回
      if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
        NavigationUtil.goBack({navigation:this.props.navigation})
        return
      }
    }
    //保存排序后的数据
    //获取排序后的数据
    //更新本地数据
    this.languageDao.save(this.getSortResult())
    //重新加载排序后的标签，以便其他页面能够及时更新
    const { onLoadLanguage } = this.props
    //更新store
    onLoadLanguage(this.params.flag)
    NavigationUtil.goBack({navigation:this.props.navigation})
  }
  getSortResult = () => {
    const flag = SortKeyPage._flag(this.props)
    //从原始数据中复制一份数据出来，以便对这份数据进行进行排序
    let sortResultArray = ArrayUtil.clone(this.props.language[flag])
    //获取排序之前的排列顺序
    const originalCheckedArray = SortKeyPage._keys(this.props)
    //遍历排序之前的数据，用排序后的数据checkedArray进行替换
    for (let i = 0, length = originalCheckedArray.length; i < length; i++) {
      let item = originalCheckedArray[i]
      //找到要替换的元素所在位置
      let index = this.props.language[flag].indexOf(item)
      //进行替换
      sortResultArray.splice(index, 1, this.state.checkedArray[i])
    }
    return sortResultArray
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
    const {theme} = this.props;
    return <Ionicons 
      name={checked?'ios-checkbox':'md-square-outline'}
      size={20}
      style={{
        color: theme.themeColor
      }}
    />
  }
  render() {
    let title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序'
    // 顶部导航栏设置
    let navigationBar = <NavigationBar
      title={title}
      style={{backgroundColor: THEME_COLOR}}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
      rightButton={ViewUtil.getRightButton('保存', () => this.onSave())}
    />
    return <View style={styles.container}>
      {navigationBar}
      <SortableListView
        style={{flex: 1}}
        data={this.state.checkedArray}
        order={Object.keys(this.state.checkedArray)}
        onRowMoved={e => {
          this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
          this.forceUpdate()
        }}
        renderRow={row => <SortCell data={row} {...this.params}/>}
      >
        {this.renderView()}
      </SortableListView>
    </View>
  }
}

class SortCell extends Component {
  render () {
    console.log(this.props)
    const { theme } = this.props
    return <TouchableHighlight
      underlayColor='#eee'
      style={this.props.data.checked ? styles.item : styles.hidden}
      {...this.props.sortHandlers}
    >
      <View style={{ marginLeft: 10, flexDirection: 'row' }}>
        <MaterialCommunityIcons
          name={'sort'}
          size={16}
          style={{ marginRight: 10, color: THEME_COLOR }}/>
        <Text>{this.props.data.name}</Text>
      </View>
    </TouchableHighlight>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray',
  },
  hidden: {
    height: 0
  },
  item: {
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 50,
    justifyContent: 'center'
  },
});
