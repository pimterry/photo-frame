const url = require('url');
const React = require('react');
const Tappable = require('react-tappable');
const api = require('./api');
const _ = require('lodash');

module.exports = class RandomFbPhotos extends React.Component {
    async componentWillMount() {
        this.state = {
            loading: true,
            imageUrl: null
        };

        while (true) {
            try {
                let images = await this.getAllImages();
                await this.showImagesInTurn(_.shuffle(images));
            } catch (e) { api.log(e.message, e.stack); }
        }
    }

    async getAllImages() {
        let images = await Promise.all([
            this.getImagesFromSet('me/photos/tagged?limit=1000000000'),
            this.getImagesFromSet('me/photos/uploaded?limit=10000000')
        ]);

        return _(images).flatten().uniqBy('id').valueOf();
    }

    async getImagesFromSet(imagesUrl) {
        let images = [];

        while (imagesUrl) {
            let results = await this.loadData(imagesUrl);
            images = images.concat(results.data);
            imagesUrl = results.next;
        }

        return images;
    }

    async loadData(bareUrl) {
        let parsedUrl = url.parse('https://graph.facebook.com/v2.8/' + bareUrl, true);
        parsedUrl.search = undefined;
        parsedUrl.query.access_token = this.props.token;

        let response = await fetch(url.format(parsedUrl));
        return response.json();
    }

    async showImagesInTurn(images) {
        while (images.length > 0) {
            await this.loadImage(images.pop());

            await Promise.race([
                new Promise((resolve) => setTimeout(resolve, 20000)),
                new Promise((resolve) => this.nextImageTrigger = resolve)
            ]);
        }
    }

    jumpToNextImage() {
        if (this.nextImageTrigger) {
            this.nextImageTrigger();
        }
    }

    async loadImage(imageMetadata) {
        let result = await this.loadData(`${imageMetadata.id}?fields=images`)

        this.setState({
            loading: false,
            imageUrl: _(result.images).maxBy((image) => image.height).source
        });
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