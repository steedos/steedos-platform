import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import FormError from '../components/FormError';
import Card from '../components/Card';
import Logo from '../components/Logo';
import Background from '../components/Background';
import LocalizedInput from '../components/LocalizedInput';
import { bindActionCreators } from 'redux';
import { initServer } from '../actions/root';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


class Init extends React.PureComponent {


  constructor(props, context) {
    super(props, context);

    this.state = {
      initParams: '',
      serverError: '',
      loading: false
    };
  }

  componentDidMount() {

  }

  handleInitParamsChange = (e) => {
    this.setState({
      initParams: e.target.value,
    });
  }

  goConsoleServer = () => {
    window.open(this.props.settings.serverInitInfo.cloud_url)
  }

  goSignup = ()=>{
    let state = {};
    if(this.state.email && this.state.email.trim().length > 0){
      state =  { email: this.state.email.trim() }
    }

    if(this.state.mobile && this.state.mobile.trim().length > 0){
      state =  { mobile: this.state.mobile.trim() }
    }
    this.props.history.push({
      pathname: `/signup`,
      search: this.props.location.search,
      state: state
    })
  }

  goHelpServer = () => {
    window.open(this.props.settings.serverInitInfo.help_url)
  }

  onSubmit = (e) => {
    this.setState({ serverError: null, loading: true });
    e.preventDefault();
    this.setState({ error: null });

    const initParams = this.state.initParams;

    if (!initParams || !initParams.trim()) {
      this.setState({
        loading: false,
        serverError: '请填写初始化参数',
      });
      return
    }

    const params = initParams.trim().split('\n');

    if (params.length != 2) {
      this.setState({
        loading: false,
        serverError: '无效的初始化参数',
      });
      return
    }

    const spaceId = params[0];
    const apiKey = params[1];

    this.props.actions.initServer(spaceId, apiKey).then(async ({ error, _next }) => {
      if (error) {
        this.setState({
          loading: false,
          serverError: error,
        });
        return;
      }
      this.props.history.push({
        pathname: `/login`,
        search: this.props.location.search
      })
    });
  }

  render() {

    return (
      <>
        <Backdrop style={{zIndex: 1}} open={this.state.loading}>
          <CircularProgress />
        </Backdrop>
        <Background />
        <Card>
          <Logo />
          <h2 className="mt-2 text-left text-2xl leading-9 font-extrabold text-gray-900">
            <FormattedMessage
              id='accounts.server_init'
              defaultMessage='初始化华炎魔方'
            />
          </h2>

          <form onSubmit={this.onSubmit} className="mt-4" autoCapitalize="none">
            <div className="rounded-md shadow-sm my-2">
              <div className="-mt-px">
                <LocalizedInput
                  type="textarea"
                  id="init_params"
                  name="init_params"
                  rows='4'
                  autocomplete="请输入激活参数"
                  value={this.state.initParams}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-md sm:leading-5"
                  placeholder={{ id: 'accounts.init_params', defaultMessage: '请输入激活参数' }}
                  onChange={this.handleInitParamsChange}
                />
              </div>
            </div>

            {this.state.serverError && <FormError error={this.state.serverError} />}

            <div className="text-sm leading-5 my-4">
            { this.props.tenant.enable_register && this.props.tenant.disabled_account_register !== true &&
              <>
                <button type="button" onClick={this.goSignup}
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none hover:underline transition ease-in-out duration-150">
                  <FormattedMessage
                      id='accounts.signup'
                      defaultMessage='Sign Up'
                  />
                </button>
                <span class="ml-1 mr-1"> | </span>
              </>
            }
              <button type="button" onClick={this.goHelpServer}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none hover:underline transition ease-in-out duration-150">
                <FormattedMessage
                  id='accounts.get_init_params'
                  defaultMessage='帮助'
                />
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button type="submit" className="rounded group relative w-32 justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-none text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out">
                <FormattedMessage
                  id='accounts.submit'
                  defaultMessage='Submit'
                />
              </button>
            </div>
          </form>
        </Card>
      </>
    );
  };
};

function mapStateToProps(state) {
  return {
    settings: getSettings(state),
    tenant: getTenant(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      initServer
    }, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Init);