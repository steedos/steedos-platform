/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>华炎开发平台</h5>
            <a href={this.docUrl('overview', this.props.language)}>
              关于“低代码”开发平台
            </a>
            <a href={this.docUrl('getting_started', this.props.language)}>
              快速向导
            </a>
            <a href="https://www-steedos-com.oss-cn-beijing.aliyuncs.com/videos/creator/contracts-demo.mp4" target="_blank">
              视频演示
            </a>
          </div>
          <div>
            <h5>案例</h5>
            <a href="https://github.com/steedos/steedos-contracts-app" target="_blank">
              合同管理            
            </a>
            <a href="https://github.com/steedos/steedos-meeting-app" target="_blank">
              会议管理            
            </a>
            <a href="https://github.com/steedos/steedos-records-app" target="_blank">
              档案管理           
            </a>
          </div>
          <div>
            <h5>更多</h5>
            <a
              href={`${this.props.config.baseUrl}docs/assets/support_qq.jpg`}
              target="_blank"
              rel="noreferrer noopener">
              技术交流QQ群：797469729
            </a>
            <a href={`${this.props.config.repoUrl}`}>GitHub</a>
            <a href={`${this.props.config.baseUrl}blog`}>动态</a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/steedos/object-server/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a>
          </div>
        </section>

        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
