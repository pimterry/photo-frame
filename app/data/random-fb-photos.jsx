const url = require('url');
const React = require('react');
const Tappable = require('react-tappable');
const _ = require('lodash');

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
        this.loadRandomImage(images).then(() => Promise.race([
            new Promise((resolve) => setTimeout(resolve, 20000)),
            new Promise((resolve) => this.nextImageTrigger = resolve)
        ])).then(() => this.repeatedlyLoadRandomImage(images));
    }

    jumpToNextImage() {
        if (this.nextImageTrigger) {
            this.nextImageTrigger();
        }
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
            return (<Tappable onTap={ this.jumpToNextImage.bind(this) }>
                <img src={this.state.imageUrl} className='random-fb-photo' />
            </Tappable>);
        }
    }
}