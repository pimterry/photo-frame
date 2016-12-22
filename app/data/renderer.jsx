const React = require('react');
const ReactDOM = require('react-dom');

const api = require('./api');
const DeviceLogin = require('./device-login');

class PhotoFrame extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            loading: true,
        };

        api.getToken().then((token) => {
            this.setState({
                loading: false,
                token: token || null
            });
        });
    }

    onTokenAcquired(token) {
        api.setToken(token);
        this.setState({
            loading: false,
            token: token
        });
    }

    render() {
        if (this.state.loading) {
            return <div>Loading...</div>;
        } else if (this.state.token) {
            return (<div>Token: { this.state.token }</div>);
        } else {
            return <DeviceLogin onTokenAcquired={ this.onTokenAcquired } />
        }
    }
}

api.log('Frame initialising');
ReactDOM.render(
    <PhotoFrame/>,
    document.getElementById('reactRoot')
)