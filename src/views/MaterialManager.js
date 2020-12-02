import React from 'react';
import { Card, Tabs } from 'antd';
import ImageTextList from '../components/ImageTextList'
import ImageList from '../components/ImageList'
import AudioList from '../components/AudioList'
import VideoList from '../components/VideoList'
import "../styles/materialManager.css";
const { TabPane } = Tabs;
export default class MaterialManager extends React.Component {
    
    render() {
        
        return (
            <Card title="素材管理" bordered={false}>
                <div>
                    <Tabs defaultActiveKey="4">
                        <TabPane tab="图文消息" key="4">
                            <ImageTextList history={this.props.history} />
                        </TabPane>
                        <TabPane tab="图片" key="1">
                            <ImageList />
                        </TabPane>
                        <TabPane tab="音频" key="2">
                            <AudioList history={this.props.history} />
                        </TabPane>
                        <TabPane tab="视频" key="3">
                            <VideoList history={this.props.history} />
                        </TabPane>
                    </Tabs>
                </div>
            </Card>
        )

    }
}