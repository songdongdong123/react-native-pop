/**
 * 路由管理类
 *
 * @export
 * @class NavigationUtil
 */
export default class NavigationUtil {
  /**
   * 重定向到首页
   * @params navigation
   * @static
   * @memberof NavigationUtil
   */
  static ResetToHomePage ({navigation}) {
    navigation.navigate('Main');
  }

  /**
   * 
   * 返回到首页
   * @static
   * @memberof NavigationUtil
   */
  static GoBack (navigation) {
    navigation.goBack();
  }
}