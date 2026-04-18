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
import axios from 'axios';
import { io } from "socket.io-client";

const _window: any = window;
_window.io = io;
_window['axios'] = axios;
_window['Builder'] = Builder;
_window['builder'] = builder;


if(_window['Steedos']){
  _window['Steedos'] = Object.assign(_window['Steedos'], Steedos);
}else{
  _window['Steedos'] = Steedos;
}

const Root: React.FC<any> = (props) => {
  const [configLoaded, setConfigLoaded] = useState<boolean>(false);

  const setBrowserFavicon = (faviconUrl?: string) => {
    if (!faviconUrl) {
      return;
    }
    const faviconLink = document.querySelector('link[rel*="icon"], link[rel*="shortcut"]') as HTMLLinkElement;
    if (faviconLink) {
      if (faviconLink.href !== faviconUrl) {
        faviconLink.href = faviconUrl;
      }
      return;
    }
    const newFaviconLink = document.createElement('link');
    newFaviconLink.rel = 'icon';
    newFaviconLink.href = faviconUrl;
    document.head.appendChild(newFaviconLink);
  };

  useEffect(() => {
    const uid = new URLSearchParams(window.location.search).get('uid');
    if (uid) {
      LocalStorageStore.setUserId(uid);
    }
    
    // 定义一个异步函数
    const loadMeAndConfig = async () => {
      try {
        await props.actions.loadSettings(); 
        await props.actions.loadMe();
        setConfigLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // 调用异步函数
    loadMeAndConfig();

  }, []);

  useEffect(() => {
    if (props.tenant && props.tenant.favicon_url) {
      setBrowserFavicon(props.tenant.favicon_url);
      try { localStorage.setItem('steedos_favicon_url', props.tenant.favicon_url); } catch (e) {}
    }

    const isOem = props.settings?.platform?.is_oem === true || props.settings?.platform?.is_oem === 'true';
    if (isOem) {
      document.body.classList.add('is-oem');
    } else {
      document.body.classList.remove('is-oem');
    }
  }, [props.tenant, props.settings]);

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