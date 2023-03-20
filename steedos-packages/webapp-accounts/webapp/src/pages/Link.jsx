/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-03-17 14:33:04
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-17 16:27:35
 * @Description: 
 */
import React from "react";
import { connect } from "react-redux";
import { getSettings, getTenant } from "../selectors";
import Card from "../components/Card";
import Background from "../components/Background";
import { bindActionCreators } from "redux";
import { initServer } from "../actions/root";


class Link extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {}
  
  render() {
    const searchParams = new URLSearchParams(this.props.location.search);
    const target = decodeURIComponent(searchParams.get('target'))
    return (
      <>
        <Background />
        <Card>
        <div className="bg-white sm:rounded-lg">
            <div className="">
                <h3 className="text-base font-semibold leading-6 text-gray-900">请注意您的账号安全</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>您即将离开本站，去往：<p class="text-orange-600 break-all">{target}</p></p>
                </div>
                <div className="mt-5">
                <a href={target} className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">继续</a>
                </div>
            </div>
            </div>
        </Card>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: getSettings(state),
    tenant: getTenant(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        initServer,
      },
      dispatch
    ),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Link);
