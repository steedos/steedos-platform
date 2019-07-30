/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer" style={{background: `rgba(0,0,0,.75)`}}>
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        华炎“低代码”开发平台
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <Logo img_src={`${baseUrl}img/icon_blue.png`} />
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button target="demo" href="https://www-steedos-com.oss-cn-beijing.aliyuncs.com/videos/creator/contracts-demo.mp4">观看案例视频</Button> &nbsp;&nbsp;
            <Button href={docUrl('getting_started.html')}>快速向导</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={props.padding}
        id={props.id}
        background={props.background}
      >
        <GridBlock
          align={props.align}
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );
    Block.defaultProps = {
      padding: ['bottom', 'top'],
    };

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection"
        style={{textAlign: 'center'}}>
        <video width="640" height="360" controls="true" poster="https://www-steedos-com.oss-cn-beijing.aliyuncs.com/videos/creator/contracts-demo.png" src="https://www-steedos-com.oss-cn-beijing.aliyuncs.com/videos/creator/contracts-demo.mp4">
        </video>
      </div>
    );

    const TryOut = () => (
      <Block id="try" background="light">
        {[
          {
            content: 'Steedos开发平台内置功能强大的报表统计与分析功能，业务人员可通过简单设定，配置出列表、分组报表、二维表进行统计分析，并可自动生成图形化报表。在报表顶部用图形化方式显示统计数据，可以显示为柱状图、折线图、饼图。设置时，还可以对特定的字段进行计数、小计、合计等统计处理。通过设定报表的查询条件，可以将统计范围缩小，提高报表的运行速度。例如可以设定只统计某个时间段的数据。平台会自动根据后台配置的用户权限，只对用户权限范围内的数据进行汇总统计。',
            image: `${baseUrl}docs/assets/mac_mobile_report.jpg`,
            imageAlign: 'right',
            title: '快速创建直观的统计分析报表',
          },
        ]}
      </Block>
    );

    const Description = () => (
      <Block background="light">
        {[
          {
            content:"提供干净和直观的体验对于任何应用程序来说都是一项挑战，为大型，元数据驱动和完全可定制的系统进行大规模的开发更是一项非凡的成就。Steedos 最终用户界面基于Salesforce Lightning Design System 设计， 开发人员无需编写一行界面代码，即可获得美观，整洁，直观的用户体验。包括可自定义的列表界面、根据业务对象配置文件自动生成的记录查看与编辑界面、查找与筛选界面、统计分析界面。",
            image: `${baseUrl}docs/assets/mac_ipad_iphone_home.png`,
            imageAlign: 'right',
            title: '自动生成美观的业务操作界面',
          },
        ]}
      </Block>
    );

    const LearnHow = () => (
      <Block>
        {[
          {
            content: '为确保业务数据的不被非法篡改，Steedos还内置强大的安全审计引擎，开发人员只需简单配置，即可启用安全审计功能，为您的业务数据保驾护航。例如当业务对象中关键字段发生变更时，Steedos可以自动记录安全审计日志，包括修改人、修改时间、字段修改内容。<br><br> 当核心业务数据被删除时，并非在数据库里真删除、而是打上已删除的标记，并自动记录操作人员和操作时间；对于保密性强的数据，系统还可记录查询日志。',
            image: `${baseUrl}docs/assets/mac_mobile_search.jpg`,
            imageAlign: 'left',
            title: '让你的业务数据更安全',
          },
        ]}
      </Block>
    );

    const Features = props => (
      <Block layout="threeColumn" align="left" {...props}>
        {[
          {
            title: '无与伦比的开发速度',
            content:
              "使用Steedos“低代码”开发平台，开发人员通过少量代码就可以构建企业级应用程序，一方面可以降低企业应用开发人力成本，另一方面可以将原有数月甚至数年的开发时间成倍缩短，从而帮助企业实现降本增效的价值。",
          },
          {
            title: '快速响应需求变更',
            content:
              '当业务需求扩张时，Steedos “低代码”平台创建的应用程序，可以轻松地进行定制和强化。例如，如果用户有了新的需求，那么开发人员可以在几个小时内完成应用程序的修改，以满足这些需求。',
          },
          {
            title: '源码版本管理与回溯',
            content:
              '与其他只提供图形化界面的“低代码”开发平台不同，Steedos中所有的开发内容均以源码的方式保存在项目文件夹中，开发人员可以使用Github进行源代码的版本管理，跟踪修订记录。',
          },
        ]}
      </Block>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          {/* <FeatureCallout padding={[]}/> */}
          <Features align="left" padding={["bottom"]}/>
          <Description />
          <LearnHow />
          <TryOut />
          {/* <Showcase /> */}
        </div>
      </div>
    );
  }
}

module.exports = Index;
