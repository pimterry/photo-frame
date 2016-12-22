const url = require('url');
const React = require('react');
const _ = require('lodash');

const ROTATION_FREQUENCY=10000;

module.exports = class RandomFbPhotos extends React.Component {
    componentWillMount() {
        this.state = {
            loading: true,
            imageUrl: null
        };

        // TODO: Refresh 'all' images occasionally
        this.getAllImages().then((images) => this.repeatedlyLoadRandomImage(images));
    }

    getAllImages() {
        return this.getImagesStartingAt('https://graph.facebook.com/v2.8/me/photos?limit=1000000000');
    }

    getImagesStartingAt(imagesUrl) {
        return this.loadData(imagesUrl).then((results) => {
            if (results.next) {
                return this.getImagesStartingAt(results.next)
                           .then((images) => results.data.concat(images));
            } else {
                return results.data;
            }
        });
    }

    loadData(bareUrl) {
        let parsedUrl = url.parse(bareUrl, true);
        parsedUrl.search = undefined;
        parsedUrl.query.access_token = this.props.token;

        return fetch(url.format(parsedUrl)).then((response) => response.json());
    }

    repeatedlyLoadRandomImage(images) {
        return this.loadRandomImage(images).then(() => setTimeout(() => this.repeatedlyLoadRandomImage(images), 10000));
    }

    loadRandomImage(images) {
        let imageMetadata = _.sample(images);

        return this.loadData(`https://graph.facebook.com/v2.8/${imageMetadata.id}?fields=images`)
                   .then((result) => this.setState({
                       loading: false,
                       imageUrl: _(result.images).maxBy((image) => image.height).source
                   }));
    }

    render() {
        if (this.state.loading) {
            return <div>Loading image...</div>;
        } else if (this.state.imageUrl) {
            return <img src={this.state.imageUrl} className='random-fb-photo' />;
        }
    }
}