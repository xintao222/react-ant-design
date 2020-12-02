import React from 'react';
import { Link } from 'react-router-dom'
import { message, Card, Button, Select, Tabs, Input, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImageSelect from '../components/ImageSelect'
import ImageTextSelect from '../components/ImageTextSelect'
import AudioSelect from '../components/AudioSelect'
import VideoSelect from '../components/VideoSelect'
import https from "../api/https";
import "../styles/message.css";
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
export default class Message extends React.Component {
    
    state = {
        disabled:false,
        msg_type:4,
        value:'',
        materialId:0,
        isAll:0,
        lables:[],
        labelList:[],
        subList:[],
        subValue:[],

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

    handleChange = (value)=> {
        
        if(value==0){
            this.setState({
                isAll: 1,
                subList: [],
                lables: []
            });
        }else{
            this.setState({
                isAll: 0,
                lables: []
            });
            this.setSubList(value)
        }
    };
    subChange = (value)=> {
        let lables = [];
        value.map(item => {
            lables.push(+item)
        })
        this.setState({
            subValue: value,
            lables: lables,
        });
    };
    setSubList = (value) =>{
        let list = this.state.labelList;
        if(list && list.length){
            for(let i=0; i<list.length; i++){
                let item = list[i];
                if(item.id == value){
                    this.setState({
                        subList: item.nodes,
                        subValue: [],
                    });
                }
            }
        }
        
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
    getLabelList = () => {
        
        https.fetchPost("/lableuser/allLable", {})
        .then(data => {
            if (data.code === 200) {
                this.setState({
                    labelList: data.data.lables,
                });
            }
        })
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
            isAll: this.state.isAll,
            lables: this.state.lables,
            msg_text_value: this.state.value,
            msg_type: this.state.msg_type,
            materialId: this.state.materialId,
            userids: []
        };

        if (params.materialId == 0 && params.msg_text_value == "") {
            message.info("发送失败，请选择素材或输入文本");
            this.setState({ disabled: false });
            return false
        } else if (params.isAll == 0 && params.lables.length == 0) {
            message.info("发送失败，请选择群发对象");
            this.setState({ disabled: false });
            return false
        }
        //console.log(params)
        https.fetchPost("/pushmessage/sendMessage", params)
        .then(data => {
            if (data.code === 200){
                message.success("发送成功");
                setTimeout(()=>{
                    window.location.reload();
                },1500)
            } 
            else message.error("发送失败");
        })


    };

    componentWillMount() {
        this.getLabelList();
    }
    render() {
        const { 
            labelList,subList,subValue,showChoose,disabled,value,
            showImageSelect,imageData,showImageTextSelect,imageTextData,
            showAudioSelect,audioData,showVideoSelect,videoData
        } = this.state
        return (
            <Card title="群发消息" bordered={false}>
                <div style={{ fontSize: 16 }}>群发对象</div>
                <div style={{ marginTop:20,marginBottom:20 }}>
                    <Select 
                        size="large" 
                        placeholder="请选择"
                        onChange={this.handleChange} 
                        style={{ width: 200,marginRight:15 }}
                    >
                        <Option key="0">全部用户</Option>
                        {
                            labelList.map((item,idx) =>{
                                return (
                                    <Option key={item.id}>{item.lableName}</Option>
                                );
                            })
                        }
                    </Select>
                    {
                        subList&&subList.length?(
                            <Select
                                mode="tags"
                                size="large"
                                value={subValue}
                                placeholder="请选择"
                                maxTagCount={1}
                                onChange={this.subChange} 
                                style={{ width: 200 }}
                            >
                            {
                                subList.map((item,idx) =>{
                                    return (
                                        <Option key={item.id}>{item.nodeName}</Option>
                                    );
                                })
                            }
                            </Select>
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