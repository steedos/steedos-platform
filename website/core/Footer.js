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
            <h5>功能</h5>
            <a href={this.docUrl('README.html', this.props.language)}>
              简介
            </a>
            <a href={this.docUrl('record_list', this.props.language)}>
              桌面客户端
            </a>
            <a href={this.docUrl('app_mobile.html', this.props.language)}>
              手机客户端
            </a>
          </div>
          <div>
            <h5>快速开始</h5>
            <a href={this.docUrl('installation', this.props.language)}>
              安装            
            </a>
            <a href={this.docUrl('object', this.props.language)}>
              配置对象            
            </a>
            <a href={this.docUrl('field', this.props.language)}>
              配置字段           
            </a>
          </div>
          <div>
            <h5>更多</h5>
            <a href={`${this.props.config.baseUrl}blog`}>动态</a>
            <a href={`${this.props.config.repoUrl}`}>GitHub</a>
            <a
              href="http://stackoverflow.com/questions/tagged/steedos"
              target="_blank"
              rel="noreferrer noopener">
              Stack Overflow
            </a>
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
