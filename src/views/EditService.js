import React from 'react';
import { Card,Form,Button,Input,InputNumber,Radio,message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import https from "../api/https";
import "../styles/other.css";

const formItemLayout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 10 },
};

export default class EditService extends React.Component {
    
    formRef = React.createRef();

    state = {
        fileInfo: {
            filename:''
        },
        select: false,
        isDisable: false,
        isUploadPortrait:0,
        error1:'',
        error2:'',
    };

    jump = () => {
        this.props.history.go(-1);
    }

    reSet = () => {
        document.getElementById('media').value = '';
        this.setState({
            fileInfo: {
                filename:''
            },
            select: false
        });
    }

    fileChange = event => {

        if (event.target.files && event.target.files[0]) {
            let file = event.target.files[0];
            const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('请上传 JPG/PNG 文件!');
                this.reSet();
                return false;
            }
            if (file.size / 1024 > 30) {
                message.error("文件大小不能超过30k");
                this.reSet();
                return false;
            }
            const formDatas = new FormData();
            formDatas.append("file", event.target.files[0]);
            https.fetchPost("/serviceAccount/uploadImg", formDatas)
            .then(data => {
                if (data.code == 200) {
                    this.setState({
                        fileInfo: data.data,
                        select: true
                    });
                    if(window.songList && window.songList.portrait) window.songList.portrait.resId = 0
                }else{
                    message.error(data.mesg); 
                }
            })
        }else{
            this.reSet();
        }
    }

    nameBlur = ({ target: { value } }) => {
        let params = {
            channel: "2",
            name: value
        };
        https.fetchGet("/serviceAccount/checkNameExist", params)
        .then(data => {
            this.setState({ error1: data.data });
            if (data.data == "error" && value!=window.songList.name) {
                message.error("服务号名称已存在，请更换服务号名称");
            }
        })
    }
    uassNameBlur = ({ target: { value } }) => {
        let params = {
            uassName: value
        };
        https.fetchGet("/serviceAccount/checkUassNameExist", params)
        .then(data => {
            this.setState({ error2: data.data });
            if (data.data == "error" && value!=window.songList.user.uassName) {
                message.error("uass用户已存在服务号，请重新更换uass用户名");
            }
        })
    }

    onFinish = values =>{

        let data = {}
        if(window.songList){
            data = window.songList;
            if(!data.portrait) data.portrait = { resId:0 }
        }
        if(this.state.fileInfo.filename!='') this.setState({ isUploadPortrait: 1 });
        else this.setState({ isUploadPortrait: 0 });

        if (!values.name) {
            message.error("请输入服务号名称");
            return false;
        }
        let tempName = 0;
        for (var k = 0; k < values.name.length; k++) {
            if(/[\u4e00-\u9fa5]/.test(values.name[k])) tempName += 2;
            else tempName++;
        }
        if(tempName>24){
            message.error("服务号名称字数不超过12个汉字或24个字母");
            return false;
        }
        let tempUassName = values.uassName.replace(/[\W]/g, "");
        if(!tempUassName) {
            message.error("请输入uass用户名");
            return false;
        }
        if(tempUassName.length > 10) {
            message.error("uass用户名支持输入数字、字母，最多10个字符");
            return false;
        }
        if (!values.keywords) {
            message.error("请输入搜索词条");
            return false;
        }
        if (!values.introduce) {
            message.error("请输入服务号介绍");
            return false;
        }
        if (!values.messageUpperLimit) {
            message.error("请输入按标签控群发次数");
            return false;
        }
        if(this.state.error1 == "error" && values.name!=data.name) {
            message.error("创建失败，服务号名称已存在");
            return false;
        }
        if(this.state.error2 == "error" && values.uassName!=data.user.uassName) {
            message.error("创建失败，uass用户名已存在服务号");
            return false;
        }
        
        let params = {
            channel: "2",
            id: data.id || 0,
            introduce: values.introduce,
            isUploadPortrait: this.state.isUploadPortrait,
            keywords: values.keywords,
            menuFlag: {
                id: data.menuFlag.id || 0,
                setHz: 0,
                setStatus: values.menuFlag
            },
            messageUpperLimit: {
                id: data.messageUpperLimit.id || 0,
                setHz: values.messageUpperLimit,
                setStatus: 0
            },
            name: values.name,
            portrait: {
                resId: data.portrait.resId || 0,
                resUrl: this.state.fileInfo.filename
            },
            qrcodeurl: "",
            qrcodeurl2: "",
            qrcodeurl3: "",
            recommendFlag: {
                id: data.recommendFlag.id || 0,
                setHz: 0,
                setStatus: values.recommendFlag
            },
            sendFlag: {
                id: data.sendFlag.id || 0,
                setHz: 0,
                setStatus: values.sendFlag
            },
            titleFlag: {
                id: data.titleFlag.id || 0,
                setHz: 0,
                setStatus: values.titleFlag
            },
            user: {
                uassId: data.user.uassId || 0,
                uassName: values.uassName
            }
        };
        this.setState({ isDisable: true });
        https.fetchPut("/serviceAccount/updateAccount", params)
        .then(data => {
            this.setState({ isDisable: false });
            if (data.code == 200) {
                message.success("修改成功");
                this.props.history.push(`/servicelist`);
            }
            else message.error(data.mesg);
        })
    }

    componentDidMount() {
        this.formRef.current.setFieldsValue({
            name: '',
            uassName: '',
            keywords: '',
            introduce: '',
            messageUpperLimit: '',
            sendFlag: '1',
            menuFlag: '1',
            titleFlag: '1',
            recommendFlag: '1',
        });
        console.log(window.songList)
        if(window.songList){
            let data = window.songList;
            this.formRef.current.setFieldsValue({
                name: data.name,
                uassName: data.user.uassName,
                keywords: data.keywords,
                introduce: data.introduce,
                messageUpperLimit: data.messageUpperLimit.setHz,
                sendFlag: data.sendFlag.setStatus+'',
                menuFlag: data.menuFlag.setStatus+'',
                titleFlag: data.titleFlag.setStatus+'',
                recommendFlag: data.recommendFlag.setStatus+'',
            });
        }
    }

    render() {
        const { fileInfo,select,isDisable } = this.state
        
        return (
            <Card title="服务号管理" bordered={false}>

                <Form
                    name="form"
                    ref={this.formRef}
                    {...formItemLayout}
                    onFinish={this.onFinish}
                >
                    <Form.Item label="服务号名称">
                        <Form.Item name="name" noStyle>
                            <Input onBlur={this.nameBlur} />
                        </Form.Item>
                        <div className="labelInfo">字数不超过12个汉字或24个字母</div>
                    </Form.Item>
                    <Form.Item label="uass用户名">
                        <Form.Item name="uassName" noStyle>
                            <Input onBlur={this.uassNameBlur} />
                        </Form.Item>
                        <div className="labelInfo">支持输入数字、字母，最多10个字符</div>
                    </Form.Item>
                    <div className="formGroup mb20">
                        <label className="inline">服务号头像：</label>
                        <div
                            className={select?"inputFile active":"inputFile"}
                            style={{marginLeft:0}}
                        >
                            <label htmlFor="media"><UploadOutlined /> 选择文件</label>
                            <input type="file" id="media" accept=".jpg,.png" onChange={this.fileChange} hidden />
                        </div>
                        <div className="fileName">
                            {fileInfo.filename}
                        </div>
                        <div className="labelInfo" style={{
                            marginLeft:"83px",
                        }}>上传文件大小不超过30KB,支持jpg，png等图片文件</div>
                    </div>
                    <Form.Item label="&emsp;搜索词条">
                        <Form.Item name="keywords" noStyle>
                            <Input.TextArea autoSize={{minRows: 3}} />
                        </Form.Item>
                        <div className="labelInfo">多个词条以“,”分隔</div>
                    </Form.Item>
                    <Form.Item label="服务号介绍">
                        <Form.Item name="introduce" noStyle>
                            <Input.TextArea autoSize={{minRows: 3}} />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="&emsp;&emsp;按标签控群发次数">
                        <Form.Item name="messageUpperLimit" noStyle>
                            <InputNumber style={{display:'inline-block',width:88}} />
                        </Form.Item>
                        <div className="labelInfo" style={{
                            display:'inline-block',
                            marginLeft:10,
                        }}>条</div>
                    </Form.Item>
                    <Form.Item name="sendFlag" label="是否支持主动消息推送">
                        <Radio.Group>
                            <Radio value="1">是</Radio>
                            <Radio value="0">否</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="menuFlag" label="&emsp;是否支持自定义菜单">
                        <Radio.Group>
                            <Radio value="1">是</Radio>
                            <Radio value="0">否</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="titleFlag" label="是否展示千人千面标签">
                        <Radio.Group>
                            <Radio value="1">是</Radio>
                            <Radio value="0">否</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="recommendFlag" label="是否在搜索页推荐展示">
                        <Radio.Group>
                            <Radio value="1">是</Radio>
                            <Radio value="0">否</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item wrapperCol={{ span: 12, offset: 9}}>
                        <Button type="primary" disabled={isDisable} htmlType="submit">
                            确定
                        </Button>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                        <Button onClick={this.jump} style={{ marginLeft: 20 }}>返回</Button>
                    </Form.Item>
                </Form>
            </Card>
        )

    }
}