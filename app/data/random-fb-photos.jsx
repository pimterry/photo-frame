const url = require('url');
const React = require('react');
const Swipeable = require('react-swipeable');
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
        let index = 0;
        const next = () => index = index + 1;
        const prev = () => index = Math.max(0, index - 1);

        while (index < images.length) {
            await this.loadImage(images[index]);

            await Promise.race([
                new Promise((resolve) => setTimeout(resolve, 20000)).then(() => next),
                new Promise((resolve) => this.nextImageTrigger = resolve).then(() => next),
                new Promise((resolve) => this.prevImageTrigger = resolve).then(() => prev)
            ]).then((action) => action());
        }
    }

    jumpToNextImage() {
        if (this.nextImageTrigger) {
            this.nextImageTrigger();
        }
    }

    jumpToPrevImage() {
        if (this.prevImageTrigger) {
            this.prevImageTrigger();
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
            return <img src='loading.gif'></img>;
        } else if (this.state.imageUrl) {
            return (<Swipeable
            onTap={ this.jumpToNextImage.bind(this) }
            onSwipedLeft={ this.jumpToNextImage.bind(this) }
            onSwipedRight={ this.jumpToPrevImage.bind(this) }>
                <img src={this.state.imageUrl} className='random-fb-photo' />
            </Swipeable>);
        }
    }
}