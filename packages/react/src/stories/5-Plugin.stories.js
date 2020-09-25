import React from 'react';
import { Provider  } from 'react-redux';
import styled from 'styled-components'
import configureStore from '../stores/configureStore';
import { registerWindowLibraries, registerPlugin, registerDefaultPlugins } from '../utils';
import { Bootstrap, Dashboard, WidgetApps, Notifications} from '../components';
import { pluginComponentSelector } from '../selectors';

export default {
  title: 'Plugin',
};

registerWindowLibraries();

class TestPlugin1 {
  initialize(registry, store) {
    const widgetApps = () => (
      <Provider store={store}>
        <Bootstrap>
          <WidgetApps />
        </Bootstrap>
      </Provider>
    );
    registry.registerObjectHomeComponent("tasks", widgetApps);

    const config = {
      apps: {
        label: "应用程序启动器",
        position: "CENTER_TOP",
        type: "apps",
        showAllItems: false
      },
      apps_mobile: {
        label: '应用列表',
        position: 'RIGHT',
        type: 'apps',
        mobile: true
      }
    }
    const configedDashboard = () => (
      <Provider store={store}>
        <Bootstrap>
          <Dashboard config={config} />
        </Bootstrap>
      </Provider>
    )
    registry.registerObjectHomeComponent("home", configedDashboard);

    registry.registerObjectIFrameHomeComponent("iframeHome", "http://www.baidu.com");

    registry.registerDashboardComponent(["oa","contracts"], configedDashboard);

    registry.registerDashboardIFrameComponent("iframeDashboard", "http://www.baidu.com");

    const NotificationsContainer = styled.div`
      float: right;
      margin: 2rem;
      clear: both;
    `;

    const notifications = () => (
      <Provider store={store}>
        <Bootstrap>
          <NotificationsContainer>
            <Notifications loadDataAfterRender={true}/>
          </NotificationsContainer>
        </Bootstrap>
      </Provider>
    )
    registry.registerNotificationsComponent("top", notifications);
  }

  uninitialize() {
    // No clean up required.
  }
}

registerPlugin('myPlugin', new TestPlugin1());

export const widgetApps = pluginComponentSelector(configureStore.getState(), "ObjectHome" ,"tasks");
export const objectHome = pluginComponentSelector(configureStore.getState(), "ObjectHome", "home");
export const objectIframeHome = pluginComponentSelector(configureStore.getState(), "ObjectHome", "iframeHome");
export const dashboard = pluginComponentSelector(configureStore.getState(), "Dashboard", "oa");
export const dashboardIframe = pluginComponentSelector(configureStore.getState(), "Dashboard", "iframeDashboard");
export const notifications = pluginComponentSelector(configureStore.getState(), "Notifications", "top");


class TestPlugin2 {
  initialize(registry, store) {
    const WProvider = window["ReactRedux"].Provider;
    const WBootstrap = window["ReactSteedos"].Bootstrap;
    const WCard = window["ReactDesignSystem"].Card;
    const WStyled = window["StyledComponents"];
    let Container = WStyled.div`
      background: #eee;
      padding: 1rem;
    `;
    const hw = () => (
      <WProvider store={store}>
        <WBootstrap>
          <WCard heading="Test Plugin Component">
            <Container>
              Hellow World
            </Container>
          </WCard>
        </WBootstrap>
      </WProvider>
    );
    registry.registerObjectHomeComponent("hw", hw);
  }

  uninitialize() {
    // No clean up required.
  }
}

registerPlugin('hwPlugin', new TestPlugin2());

export const hellowWorld = pluginComponentSelector(configureStore.getState(), "ObjectHome", "hw");

registerDefaultPlugins();

const NotificationsContainer = styled.div`
  float: right;
  margin: 2rem;
  clear: both;
`;
const NotificationsInDefaultPlugin = pluginComponentSelector(configureStore.getState(), "Notifications", "steedos-default-header-notifications");

export const defaultPlugin = () => (
  <NotificationsContainer>
    <NotificationsInDefaultPlugin id="test_notifications_in_default_plugin" loadDataAfterRender={false} />
  </NotificationsContainer>
)