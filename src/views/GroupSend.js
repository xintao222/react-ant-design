import React from 'react';
import { Link } from 'react-router-dom'
import { message, Card, Button, Tabs, Input, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImageSelect from '../components/ImageSelect'
import ImageTextSelect from '../components/ImageTextSelect'
import AudioSelect from '../components/AudioSelect'
import VideoSelect from '../components/VideoSelect'
import https from "../api/https";
import "../styles/message.css";
const { TabPane } = Tabs;
const { TextArea } = Input;
export default class GroupSend extends React.Component {
    
    state = {
        disabled:false,
        msg_type:4,
        value:'',
        materialId:0,
        lables:[],
        lableList:[],
        userids:[],
        useridList:[],

        showChoose:false,
        showImageSelect:false,
        imageData:null,
        showImageTextSelect:false,
        imageTextData:null,
        showAudioSelect:false,
        audioData:null,
        showVideoSelect:false,
        videoData:null,
    };

    textAreaChange = ({ target: { value } }) => {
        this.setState({ value });
    };

    tabChange = (key)=> {
        this.setState({
            msg_type:key,
            showChoose:false,
            imageTextData:null,
            imageData:null,
            audioData:null,
            videoData:null,
            value:'',
            materialId:0
        });
    };

    openImageTextSelect = () => {
        this.setState({
            showImageTextSelect: true,
        });
    };
    ComfirmImageText = (item) => {
        if(item){
            this.setState({
                showImageTextSelect:false,
                imageTextData:item,
                showChoose:true,
                materialId:item.publicImageTextList[0].materialId,
            });
            //console.log(item)
        }
        else this.setState({ showImageTextSelect: false, })
    };
    openImageSelect = () => {
        this.setState({
            showImageSelect: true,
        });
    };
    ComfirmImage = (item) => {
        if(item){
            this.setState({
                showImageSelect: false,
                imageData:item,
                showChoose:true,
                materialId:item.materialId,
            });
        }
        else this.setState({ showImageSelect: false, })
    };
    openAudioSelect = () => {
        this.setState({
            showAudioSelect: true,
        });
    };
    ComfirmAudio = (item) => {
        if(item){
            this.setState({
                showAudioSelect: false,
                audioData:item,
                showChoose:true,
                materialId:item.materialId,
            });
        }
        else this.setState({ showAudioSelect: false, })
    };
    openVideoSelect = () => {
        this.setState({
            showVideoSelect: true,
        });
    };
    ComfirmVideo = (item) => {
        if(item){
            this.setState({
                showVideoSelect: false,
                videoData:item,
                showChoose:true,
                materialId:item.materialId,
            });
        }
        else this.setState({ showVideoSelect: false, })
    };

    fileChange = event => {

        if (event.target.files && event.target.files[0]) {
            let file = event.target.files[0];
            const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('请上传 JPG/PNG 文件!');
                return false;
            }
            if (file.size / 1024 > 30) {
                message.error("文件大小不能超过30k");
                return false;
            }
            const formDatas = new FormData();
            formDatas.append("file", event.target.files[0]);
            https.fetchPost("/material/image/upload", formDatas)
            .then(data => {
                if (data.code == 200) {
                    message.success(`上传成功`);
                    document.getElementById('media').value = '';
                }else{
                    message.error(data.mesg); 
                }
            })
        }
    }

    submit = () => {
        
        //开始可以点击
        this.setState({ disabled: true });
        
        let params = {
            groupids: [0],
            isAll: 0,
            lables: this.state.lables,
            msg_text_value: this.state.value,
            msg_type: this.state.msg_type,
            materialId: this.state.materialId,
            userids: this.state.userids
        };

        if (params.materialId == 0 && params.msg_text_value == "") {
            message.info("发送失败，请选择素材或输入文本");
            this.setState({ disabled: false });
            return false
        } else if (params.userids.length == 0 && params.lables.length == 0) {
            message.info("发送失败，请选择群发对象");
            this.setState({ disabled: false });
            return false
        }
        //console.log(params)
        https.fetchPost("/pushmessage/sendMessage", params)
        .then(data => {
            if (data.code === 200){
                message.success("发送成功");
                let { history } = this.props
                history.push({pathname: '/userManager'})
            } 
            else message.error("发送失败");
        })


    };

    onTagsList = () => {

        let lableList = [], lables = [];
        if (window.tagsIdList.length < 5) {
          for (let i = 0; i < window.tagsIdList.length; i++) {
            lableList.push(window.tagsIdList[i].nodeName);
          }
        } else {
            lableList.push(
                window.tagsIdList[0].nodeName,
                window.tagsIdList[1].nodeName,
                window.tagsIdList[2].nodeName,
                window.tagsIdList[3].nodeName,
                window.tagsIdList[4].nodeName
            );
        }
        for (let items of window.tagsIdList) {
            lables.push(items.id);
        }
        this.setState({ 
            lables: lables,
            lableList: lableList
        });
    }
    
    onAdminList = () => {

        let useridList = [], userids = [];
        if (window.adminList.length < 5) {
          for (let i = 0; i < window.adminList.length; i++) {
            useridList.push(window.adminList[i].name);
          }
        } else {
            useridList.push(
                window.adminList[0].name,
                window.adminList[1].name,
                window.adminList[2].name,
                window.adminList[3].name,
                window.adminList[4].name
            );
        }
        for (let items of window.adminList) {
            userids.push(items.fouce_id);
        }
        this.setState({ 
            userids: userids,
            useridList: useridList
        });
    }

    componentWillMount() {
        //console.log(window.tagsIdList,window.adminList)
        if (window.tagsIdList && window.tagsIdList.length) {
            this.onTagsList();
        } else {
            if (window.adminList && window.adminList.length) this.onAdminList();
        }
    }
    render() {
        const { 
            showChoose,disabled,value,lableList,lables,useridList,userids,
            showImageSelect,imageData,showImageTextSelect,imageTextData,
            showAudioSelect,audioData,showVideoSelect,videoData
        } = this.state
        return (
            <Card title="群发消息" bordered={false}>
                <div style={{ fontSize: 16 }}>群发对象</div>
                <div className="object">
                {
                    lableList&&lableList.length?(
                        <Space>
                        {
                            lableList.map((item,idx) =>{
                                return (
                                    <span key={item}>{item},</span>
                                );
                            })
                        }
                        {
                            lables.length>5?(
                                <span>等{lables.length}个标签</span>
                            ):''
                        }
                        </Space>
                    ):''
                }
                {
                    useridList&&useridList.length?(
                        <Space>
                        {
                            useridList.map((item,idx) =>{
                                return (
                                    <span key={item}>{item},</span>
                                );
                            })
                        }
                        {
                            userids.length>5?(
                                <span>等{userids.length}人</span>
                            ):''
                        }
                        </Space>
                    ):''
                }
                </div>
                <div className="card-container">
                    <Tabs onChange={this.tabChange} type="card">
                        <TabPane tab="图文消息" key="1">
                        {
                            showChoose&&imageTextData?(
                                <Space size="middle">  
                                    <div className="choose" style={{marginLeft:40}}>
                                        <div style={{marginTop:20,paddingLeft:20,paddingRight:20,textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>{imageTextData.publicImageTextList[0].title}</div>
                                        <img style={{marginTop:10}} height={200} width={200} src={imageTextData.publicImageTextList[0].pushImageUrl} alt="" />
                                        <div style={{marginTop:10}}>{imageTextData.createTime}</div>
                                    </div>
                                </Space>
                            ):
                            <Space size="middle">  
                                <div onClick={() => this.openImageTextSelect() } className="choose" style={{marginLeft:40}}>
                                    <PlusOutlined  style={{marginTop:80,fontSize:40,color:'#ddd'}}/>
                                    <div style={{marginTop:15,fontSize:17,color:'#d6d6d6'}}>从素材库中选择</div>
                                </div>
                                <div className="choose">
                                    <Link to={'/addImageText'} >
                                        <PlusOutlined  style={{marginTop:80,fontSize:40,color:'#ddd'}}/>
                                        <div style={{marginTop:15,fontSize:17,color:'#d6d6d6'}}>新建图文消息</div>
                                    </Link>
                                </div>
                            </Space>
                        }  
                        </TabPane>
                        <TabPane tab="文字" key="2">
                            <div style={{marginLeft:16,marginRight:16,marginBottom:46}}>
                                <TextArea rows={15} onChange={this.textAreaChange} value={value} maxLength="600" />
                            </div>
                        </TabPane>
                        <TabPane tab="图片" key="3">
                        {
                            showChoose&&imageData?(
                                <Space size="middle">  
                                    <div className="choose" style={{marginLeft:40}}>
                                        <div style={{marginTop:20,paddingLeft:20,paddingRight:20,textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>{imageData.resName}</div>
                                        <img style={{marginTop:10}} height={200} width={200} src={imageData.resUrl} alt="" />
                                        <div style={{marginTop:10}}>{imageData.resCreateTime}</div>
                                    </div>
                                </Space>
                            ):
                            <Space size="middle">  
                                <div onClick={() => this.openImageSelect() } className="choose" style={{marginLeft:40}}>
                                    <PlusOutlined  style={{marginTop:80,fontSize:40,color:'#ddd'}}/>
                                    <div style={{marginTop:15,fontSize:17,color:'#d6d6d6'}}>从素材库中选择</div>
                                </div>
                                <div className="choose">
                                    <PlusOutlined  style={{marginTop:80,fontSize:40,color:'#ddd'}}/>
                                    <div style={{marginTop:15,fontSize:17,color:'#d6d6d6'}}>本地上传图片</div>
                                    <label htmlFor="media"></label>
                                    <input type="file" id="media" accept=".jpg,.png" onChange={this.fileChange} hidden />
                                </div>
                            </Space>
                        } 
                        </TabPane>
                        <TabPane tab="音频" key="4">
                        {
                            showChoose&&audioData?(
                                <Space size="middle">  
                                    <div className="choose" style={{marginLeft:40}}>
                                        <div style={{marginTop:20,paddingLeft:20,paddingRight:20,textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>{audioData.resName}</div>
                                        <audio
                                            style={{border:'none',outline:'none',width: 200, height: 200,paddingTop: 10}}
                                            src={audioData.resUrl}
                                            controls="controls"
                                        ></audio>
                                        <div style={{marginTop:10}}>{audioData.resCreateTime}</div>
                                    </div>
                                </Space>
                            ):
                            <Space size="middle">  
                                <div onClick={() => this.openAudioSelect() } className="choose" style={{marginLeft:40}}>
                                    <PlusOutlined  style={{marginTop:80,fontSize:40,color:'#ddd'}}/>
                                    <div style={{marginTop:15,fontSize:17,color:'#d6d6d6'}}>从素材库中选择</div>
                                </div>
                                <div className="choose">
                                    <Link to={'/createAudio'} >
                                        <PlusOutlined  style={{marginTop:80,fontSize:40,color:'#ddd'}}/>
                                        <div style={{marginTop:15,fontSize:17,color:'#d6d6d6'}}>本地上传音频</div>
                                    </Link>
                                </div>
                            </Space>
                        }
                        </TabPane>
                        <TabPane tab="视频" key="5">
                        {
                            showChoose&&videoData?(
                                <Space size="middle">  
                                    <div className="choose" style={{marginLeft:40}}>
                                        <div style={{marginTop:20,paddingLeft:20,paddingRight:20,textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>{videoData.resName}</div>
                                        <video
                                            style={{border:'none',outline:'none',width: 200, height: 200,paddingTop: 10}}
                                            src={videoData.resUrl}
                                            controls="controls"
                                        ></video>
                                        <div style={{marginTop:10}}>{videoData.resCreateTime}</div>
                                    </div>
                                </Space>
                            ):
                            <Space size="middle">  
                                <div onClick={() => this.openVideoSelect() } className="choose" style={{marginLeft:40}}>
                                    <PlusOutlined  style={{marginTop:80,fontSize:40,color:'#ddd'}}/>
                                    <div style={{marginTop:15,fontSize:17,color:'#d6d6d6'}}>从素材库中选择</div>
                                </div>
                                <div className="choose">
                                    <Link to={'/createVideo'} >
                                        <PlusOutlined  style={{marginTop:80,fontSize:40,color:'#ddd'}}/>
                                        <div style={{marginTop:15,fontSize:17,color:'#d6d6d6'}}>本地上传视频</div>
                                    </Link>
                                </div>
                            </Space>
                        }
                        </TabPane>
                    </Tabs>
                </div>
                <div>
                    <Button style={{marginTop:20}}
                        type="primary" size="large"
                        disabled={disabled}
                        onClick={this.submit}
                    >群发</Button>
                </div>
                {
                    showImageSelect?(
                        <ImageSelect ComfirmSelect={this.ComfirmImage} />
                    ):''
                }
                {
                    showImageTextSelect?(
                        <ImageTextSelect ComfirmSelect={this.ComfirmImageText} />
                    ):''
                }
                {
                    showAudioSelect?(
                        <AudioSelect ComfirmSelect={this.ComfirmAudio} />
                    ):''
                }
                {
                    showVideoSelect?(
                        <VideoSelect ComfirmSelect={this.ComfirmVideo} />
                    ):''
                }
            </Card>
        )

    }
}