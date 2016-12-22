const React = require('react');

const api = require('./api');

class LoginTimeoutError extends Error {
    constructor() {
        super('Login attempt timed out.');
    }
}

module.exports = class DeviceLogin extends React.Component {
    componentWillMount() {
        this.startLoginProcess();
    }

    startLoginProcess() {
        this.state = {
            loading: true,
            userCode: null,
            verificationUri: null,
            error: null
        };

        api.startDeviceLogin().then((loginData) => {
            this.setState({
                loading: false,
                userCode: loginData.user_code,
                verificationUri: loginData.verification_uri
            });

            return this.waitForLogin(loginData);
        }).then((token) => {
            this.props.onTokenAcquired(token);
        }).catch((error) => {
            api.log(error);
            this.setState({ loading: false, error });
            setTimeout(() => this.startLoginProcess(), 5000);
        });
    }

    waitForLogin(loginData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.checkDeviceLoginStatus(loginData).then((token) => {
                    if (token) {
                        resolve(token);
                    } else {
                        resolve(this.waitForLogin(loginData));
                    }
                }).catch(reject);
            }, loginData.interval * 1000);
        });
    }

    checkDeviceLoginStatus(loginData) {
        return api.checkDeviceLoginStatus(loginData).then((result) => {
            if (result.access_token) {
                return result.access_token;
            } else if (result.error) {
                switch (result.error.code) {
                    case 31: // Not yet confirmed
                        return null;
                    case 463: // Device code has timed out
                        throw new LoginTimeoutError();
                    default:
                        throw new Error('Unknown device login error: ' + JSON.stringify(result));
                }
            } else {
                throw new Error('Unknown device login status response: ' + JSON.stringify(result.error));
            }
        });
    }

    render() {
        if (this.state.loading) {
            return <div>Starting login process...</div>
        } else if (this.error) {
            return <div className="error">{ this.error }</div>
        } else if (this.state.userCode) {
            return (<div className="login-info">
                <h1>Welcome to your photo frame!</h1>
                <p>
                To set up, open "{ this.state.verificationUri }", and enter:
                </p>
                <div className="device-code">
                    { this.state.userCode }
                </div>
            </div>)
        } else {
            return (<div className="error">
                Unknown login state!
                { JSON.stringify(this.state) }
            </div>)
        }
    }
}