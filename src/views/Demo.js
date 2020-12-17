import React from 'react';
import { Card } from 'antd';
import "../styles/message.css";

export default class Demo extends React.Component {
    
    state = {
        time: 30,
    };

    componentWillMount() {
        let time = 0;
        let tt = setInterval(() => {
            time = this.state.time--;
            console.log(time)
            if(time==0){
                console.log('清除Session')
                clearInterval(tt);
            }
        }, 1000);
    }

    render() {

        const {  } = this.state;
        
        return (
            <Card title="示例" bordered={false}>
                
            </Card>
        )

    }
}