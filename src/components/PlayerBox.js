import React from 'react';
import VideoPlayer from '../components/VideoPlayer'

export default class PlayerBox extends React.Component {

    state = {
        data: "http://10.10.202.189:28082/group1/M00/00/14/CgrKvl6aq_zl6edkAA6eacbKKag954.mp4"
    };
    
    render() {
    
        return (
            <VideoPlayer videoUrl={this.state.data} />
        )

    }
}