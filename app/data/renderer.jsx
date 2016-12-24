const React = require('react');
const ReactDOM = require('react-dom');

const api = require('./api');
const DeviceLogin = require('./device-login');
const RandomFbPhotos = require('./random-fb-photos');

class PhotoFrame extends React.Component {
    async componentWillMount() {
        this.state = {
            loading: true,
        };

        this.setState({
            loading: false,
            token: (await api.getToken()) || null
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
            return <div>Starting up...</div>;
        } else if (this.state.token) {
            return <RandomFbPhotos token={ this.state.token } />
        } else {
            return <DeviceLogin onTokenAcquired={ this.onTokenAcquired.bind(this) } />
        }
    }
}

api.log('Frame initialising');
ReactDOM.render(
    <PhotoFrame/>,
    document.getElementById('reactRoot')
)