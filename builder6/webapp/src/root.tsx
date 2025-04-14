import React, { useState, useEffect } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { getTenant, getSettings } from './selectors';
import { getCurrentUser } from './selectors/entities/users';
import { getCurrentSpaceId } from './selectors/entities/spaces';
import LocalStorageStore from './stores/local_storage_store';
import { SteedosRouter } from './router';
import { Builder, builder, BuilderComponent, AssetsLoader } from '@builder6/react';
import { loadSettings } from './actions/settings';
import { loadMe } from './actions/users';
import { Steedos } from './utils/steedos';
import { t } from 'i18next';

const _window: any = window;
_window['Builder'] = Builder;
_window['builder'] = builder;
_window['t'] = function(key: any, parameters: any, locale: string){
  if(!key){
      return key;
  }
  if (locale === "zh-cn") {
      locale = "zh-CN";
  }
  let keys;
  if(lodash.isArray(key)){
      keys = key;
  }else{
      keys = [`CustomLabels.${key}`, key];
  }
  if ((parameters != null) && !(lodash.isObject(parameters))) {
      return t(keys, { lng: locale, postProcess: 'sprintf', sprintf: [parameters], keySeparator: false});
  } else {
      return t(keys, Object.assign({lng: locale}, {keySeparator: false}, parameters));
  }
};

if(_window['Steedos']){
  _window['Steedos'] = Object.assign(_window['Steedos'], Steedos);
}else{
  _window['Steedos'] = Steedos;
}

const Root: React.FC<any> = (props) => {
  const [configLoaded, setConfigLoaded] = useState<boolean>(false);

  useEffect(() => {
    const uid = new URLSearchParams(window.location.search).get('uid');
    if (uid) {
      LocalStorageStore.setUserId(uid);
    }
    
    // 定义一个异步函数
    const loadMeAndConfig = async () => {
      try {
        await props.actions.loadSettings(); 

        if (props.tenant && props.tenant.favicon_url) {
          const faviconLink = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
          if (faviconLink) {
            faviconLink.href = props.tenant.favicon_url;
          }
        }

        await props.actions.loadMe();
        setConfigLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // 调用异步函数
    loadMeAndConfig();

  }, []);

  if (!configLoaded) {
    return <div />;
  }

  return (
    <>
      {
      // @ts-ignore
      <AssetsLoader
          urls = {Builder.settings.assetUrls}>
        <SteedosRouter />
      </AssetsLoader>
      }
    </>
  );
};

const mapStateToProps = (state: any) => ({
  tenant: getTenant(state),
  settings: getSettings(state),
  currentUser: getCurrentUser(state),
  currentSpaceId: getCurrentSpaceId(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators({ loadSettings, loadMe }, dispatch),
});

//@ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Root);