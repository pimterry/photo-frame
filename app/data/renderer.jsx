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

        api.getToken().then((fbToken) => {
            this.setState({
                loading: false,
                token: fbToken || null
            });
        });
    }

    render() {
        if (this.state.loading) {
            return <div>Loading...</div>;
        } else if (this.state.token) {
            return (<div>Token: { this.state.token }</div>);
        } else {
            return <DeviceLogin onTokenAcquired={ (token) => this.setState({ token }) } />
        }
    }
}

api.log('Frame initialising');
ReactDOM.render(
    <PhotoFrame/>,
    document.getElementById('reactRoot')
)