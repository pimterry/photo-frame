const React = require('react');

const api = require('./api');

module.exports = class DeviceLogin extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.startLoginProcess();
    }

    startLoginProcess() {
        this.state = {
            loading: true,
            userCode: null,
            error: null
        };

        api.startDeviceLogin().then((loginData) => {
            this.setState({
                loading: false,
                userCode: loginData.user_code
            });

            return this.waitForLogin();
        }).then((token) => {
            this.props.onTokenAcquired(token);
        }).catch((error) => {
            this.setState({ loading: false, error });
            setTimeout(() => this.startLoginProcess(), 5000);
        });
    }

    waitForLogin() {
    }

    render() {
        if (this.state.loading) {
            return <div>Starting Facebook login process...</div>
        } else if (this.state.userCode) {
            return (<div>
                Welcome to your photo frame!<br/>
                To set up, open "facebook.com/device", log into your
                facebook, and enter the below code:
                <div className="device-code">
                    { this.state.userCode }
                </div>
            </div>)
        } else if (this.error) {
            return <div className="error">{ this.error }</div>
        } else {
            return (<div className="error">
                Unknown login state!
                { JSON.stringify(this.state) }
            </div>)
        }
    }
}