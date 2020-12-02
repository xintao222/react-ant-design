import React from 'react';
import { Card } from 'antd';
import https from "../api/https";
import "../styles/message.css";

export default class Demo extends React.Component {
    
    state = {
        time: 30,
    };

    componentWillMount() {
        
        https.fetchGet("/serviceAccount/selectAccount", {
            id: 600000000026
        })
        .then(data => {
            if (data.code === 200) {
                console.log(data)
            }
        })
        
        https.fetchPost("/banner", {
            id: 600000000026
        })
        .then(data => {
            if (data.code === 200) {
                console.log(data)
            }
        })
    }

    render() {

        const {  } = this.state;
        
        return (
            <Card title="示例" bordered={false}>
                
            </Card>
        )

    }
}