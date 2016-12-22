const React = require('react');
const ReactDOM = require('react-dom');

const api = require('./api');
const DeviceLogin = require('./device-login');
const RandomFbPhotos = require('./random-fb-photos');

class PhotoFrame extends React.Component {
    componentWillMount() {
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
            return <RandomFbPhotos token={ this.state.token } />
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