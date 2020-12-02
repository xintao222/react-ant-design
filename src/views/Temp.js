import React from 'react';
import { Editor } from '@tinymce/tinymce-react'; 
import { Card,Tabs } from 'antd';
import "../styles/message.css";
const { TabPane } = Tabs;

export default class Temp extends React.Component {
    
    state = {
        activeKey:'2',
    };

    handleEditorChange = (e) => {
        // console.log(
        //     'Content was updated:',
        //     e.target.getContent()
        // );
    }

    componentWillMount() {
        setTimeout(()=>{
            this.setState({
                activeKey: '1'
            });
        },3000)
    }

    render() {
        
        return (
            <Card title="用户管理" bordered={false}>

                <Tabs activeKey={this.state.activeKey} type="card">
                    <TabPane tab="Tab Title 1" key="1">
                        <p>Content of Tab Pane 1</p>
                        <p>Content of Tab Pane 1</p>
                        <p>Content of Tab Pane 1</p>
                    </TabPane>
                    <TabPane tab="Tab Title 2" key="2">
                        <p>Content of Tab Pane 2</p>
                        <p>Content of Tab Pane 2</p>
                        <p>Content of Tab Pane 2</p>
                    </TabPane>
                    <TabPane tab="Tab Title 3" key="3">
                        <p>Content of Tab Pane 3</p>
                        <p>Content of Tab Pane 3</p>
                        <p>Content of Tab Pane 3</p>
                    </TabPane>
                </Tabs>

                <Editor
                    apiKey="coex6yg7qr4v4niw88ee2e2hh11wty3fydz0zx5iysfvuwkb"
                    initialValue="<p>Initial content</p>"
                    init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image', 
                        'charmap print preview anchor help',
                        'searchreplace visualblocks code',
                        'insertdatetime media table paste wordcount'
                    ],
                    toolbar:
                        'undo redo | formatselect | bold italic | \
                        alignleft aligncenter alignright | \
                        bullist numlist outdent indent | help'
                    }}
                    onChange={this.handleEditorChange}
                />
            </Card>
        )

    }
}