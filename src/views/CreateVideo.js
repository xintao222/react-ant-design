import React from 'react';
import { Card,Form,Button,Input,message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import https from "../api/https";
import "../styles/other.css";

const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 8 },
};

export default class CreateVideo extends React.Component {
    
    state = {
        fileInfo: {},
        select: false,
        isDisable: false,
    };

    jump = () => {
        this.props.history.go(-1);
    }

    reSet = () => {
        document.getElementById('media').value = '';
        this.setState({
            fileInfo: {},
            select: false
        });
    }

    fileChange = event => {

        if (event.target.files && event.target.files[0]) {
            let file = event.target.files[0];
            let arr = file.name.split('.');
            let fileName = arr[arr.length-1];
            if ( fileName != 'mp4') {
                message.error("请选择mp4文件");
                this.reSet();
                return false;
            }
            if (file.size / 1024 / 1024 > 2) {
                message.error("文件大小不能超过2M");
                this.reSet();
                return false;
            }
            this.setState({
                fileInfo: event.target.files[0],
                select: true
            });
        }
    }

    onFinish = values =>{

        this.setState({ isDisable: true });

        if ( values.title == "" || values.desc == "" || !this.state.select ){
            message.error("创建失败，文件、标题或简介不能为空");
            this.setState({ isDisable: false });
            return false;
        }

        const formDatas = new FormData();
        formDatas.append("media", this.state.fileInfo);
        formDatas.append("title", values.title);
        formDatas.append("desc", values.desc);
        https.fetchPost("/material/video/upload", formDatas)
        .then(data => {
            this.setState({ isDisable: false });
            if (data.code == 200) {
                message.success('上传成功!');
                this.props.history.push(`/materialManager`);
            }else{
                message.error(data.mesg); 
            }
        })
    }

    render() {
        const { fileInfo,select,isDisable } = this.state
        
        return (
            <Card title="新建视频" bordered={false}>

                <Form
                    name="form"
                    layout="vertical"
                    {...formItemLayout}
                    onFinish={this.onFinish}
                >
                    
                    <div className="formGroup">
                        <label>视频</label>
                        <div
                            className={select?"inputFile active":"inputFile"}
                        >
                            <label htmlFor="media"><UploadOutlined /> 选择文件</label>
                            <input type="file" id="media" accept=".mp4" onChange={this.fileChange} hidden />
                        </div>
                        <div className="fileName">
                            {fileInfo.name}
                        </div>
                        <div style={{
                        display:'block',
                        fontSize:13,
                        color: "rgb(154, 141, 141)",
                        marginTop:5,
                        }}>上传文件大小不超过2M，仅支持MP4视频文件。</div>
                    </div>
                    <Form.Item name="title" label="标题">
                        <Input />
                    </Form.Item>
                    <Form.Item name="desc" label="简介">
                        <Input />
                    </Form.Item>

                    <Form.Item wrapperCol={{ span: 12, offset: 0 }}>
                        <Button type="primary" disabled={isDisable} htmlType="submit">
                            立即创建
                        </Button>
                        <Button onClick={this.jump} style={{ marginLeft: 20 }}>返回</Button>
                    </Form.Item>
                </Form>
            </Card>
        )

    }
}