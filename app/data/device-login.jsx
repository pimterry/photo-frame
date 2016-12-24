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

    async startLoginProcess() {
        this.state = {
            loading: true,
            userCode: null,
            verificationUri: null,
            error: null
        };

        try {
            let loginData = await api.startDeviceLogin();
            this.setState({
                loading: false,
                userCode: loginData.user_code,
                verificationUri: loginData.verification_uri
            });

            let token = await this.waitForLogin(loginData);
            this.props.onTokenAcquired(token);
        } catch (error) {
            api.log(error.message);
            this.setState({ loading: false, error });
            setTimeout(() => this.startLoginProcess(), 5000);
        };
    }

    async waitForLogin(loginData) {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    let token = await this.checkDeviceLoginStatus(loginData);
                    if (token) {
                        resolve(token);
                    } else {
                        resolve(this.waitForLogin(loginData));
                    }
                } catch (e) { reject(e); }
            }, loginData.interval * 1000);
        });
    }

    async checkDeviceLoginStatus(loginData) {
        let result = await api.checkDeviceLoginStatus(loginData);
        
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
    }

    render() {
        if (this.state.loading) {
            return <div>Starting login process...</div>
        } else if (this.error) {
            return <div className="error">{ this.error.message }</div>
        } else if (this.state.userCode) {
            return (<div className="login-info">
                <h1>Welcome to your photo frame!</h1>
                <p>
                To set up, open <span className='url'>{ this.state.verificationUri }</span>, and enter:
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