import React from 'react';
import Player from 'griffith'

export default class VideoPlayer extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }
    
    render() {
        const sources = {
            hd: {
                bitrate: 2005,
                size: 46723282,
                duration: 182,
                format: 'mp4',
                width: 350,
                height: 320,
                play_url: this.props.videoUrl

            },
            sd: {
                bitrate: 900.49,
                size: 20633151,
                duration: 182,
                format: 'mp4',
                width: 350,
                height: 320,
                play_url: this.props.videoUrl
            },
        }

        const data = {
            id: 'player',
            standalone: true,
            title: '',
            cover: '',
            duration: 182,
            sources,
            autoplay: true,
            shouldObserveResize: true,
            src: this.props.videoUrl
        }
        return (
            <Player {...data} />
        )

    }
}