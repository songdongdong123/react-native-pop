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
   * 返回
   * @static
   * @memberof NavigationUtil
   */
  static goBack ({navigation}) {
    navigation.goBack();
  }

  /**
   * 跳转到指定页面
   * @params 要传递的参数
   * @page   要跳转的页面
   * @memberof NavigationUtil
   */
  static goPage (params, page) {
    const navigation = NavigationUtil.navigation;
    if (!navigation) {
      console.log('NavigationUtil.navigation can not null !!!');
      return;
    }
    navigation.navigate(page, {
      ...params
    });
  }
}