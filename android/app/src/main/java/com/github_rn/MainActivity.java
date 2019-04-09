package com.github_rn;

import android.nfc.Tag;
import android.os.Bundle; // here
import android.util.Log;


import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import org.devio.rn.splashscreen.SplashScreen; // here

import com.umeng.analytics.MobclickAgent;
import com.umeng.commonsdk.UMConfigure;
// import com.umeng.message.IUmengRegisterCallback;
// import com.umeng.message.PushAgent;

public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // 添加这一句
        super.onCreate(savedInstanceState);
        // 注意：如果您已经在AndroidManifest.xml中配置过appkey和channel值，可以调用此版本初始化函数。
        UMConfigure.init(this, "5caac8a63fc1955789000d88", "Umeng", UMConfigure.DEVICE_TYPE_PHONE, null);
        // interval: 单位是毫秒，默认Session间隔时间是30秒
        MobclickAgent.setSessionContinueMillis(30000);
        MobclickAgent.setPageCollectionMode(MobclickAgent.PageMode.LEGACY_MANUAL);
        UMConfigure.setProcessEvent(true);
    }

    public void onResume() {
      super.onResume();
      MobclickAgent.onResume(this);
    }
    public void onPause() {
      super.onPause();
      MobclickAgent.onPause(this);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Github_RN";
    }
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
      return new ReactActivityDelegate(this, getMainComponentName()) {
        @Override
        protected ReactRootView createRootView() {
            return new RNGestureHandlerEnabledRootView(MainActivity.this);
        }
      };
    }
}
