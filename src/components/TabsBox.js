import React from 'react';
import { Card, Tabs, Input, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImageSelect from './ImageSelect'
import ImageTextSelect from './ImageTextSelect'
import https from "../api/https";
import "../styles/tabsBox.css";
const { TabPane } = Tabs;
const { TextArea } = Input;
export default class TabsBox extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            disabled:false,
            materiaType: '1',
            activeKey: '1',
            menuClicktext:'',
            materialId:0,

            showChoose:false,
            showImageSelect:false,
            imageData:null,
            showImageTextSelect:false,
            imageTextData:null,
        }
    }

    setData = (item) => {
        //console.log(item)
        this.setState({
            disabled:false,
            materiaType: item.materiaType+'',
            activeKey: '1',
            menuClicktext:'',
            materialId:0,

            showChoose:false,
            showImageSelect:false,
            imageData:null,
            showImageTextSelect:false,
            imageTextData:null,
        });
        if (item.materiaType == 0) this.setState({ menuClicktext: item.menuClicktext});
        if (item.materiaType == 1 && item.materialId) this.getImageTextInfo(item.materialId)
        if (item.materiaType == 4 && item.materialId) this.getImageInfo(item.materialId)
    };

    getImageInfo = (id) => {
        https.fetchGet("/material/image/info", {id: id}).then(data => {
            if (data.code === 200) {
                let item = data.data;
                this.setState({
                    showImageSelect:false,
                    imageData:item,
                    showChoose:true,
                    materialId:item.materialId,
                });
            }
        })
    };
    getImageTextInfo = (id) => {
        https.fetchGet("/material/imagetext/info", {id: id}).then(data => {
            if (data.code === 200) {
                let item = data.data;
                //console.log(data)
                this.setState({
                    showImageTextSelect:false,
                    imageTextData:item,
                    showChoose:true,
                    materialId:item.publicImageTextList[0].materialId,
                });
            }
        })
    };

    textAreaChange = ({ target: { value } }) => {
        this.setState({ menuClicktext: value });
    };
    tabChange = (key)=> {
        this.setState({
            materiaType:key,
            showChoose:false,
            imageTextData:null,
            imageData:null,
            menuClicktext:'',
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

    componentWillMount() {
        
    }
    render() {
        const { 
            showChoose,materiaType,menuClicktext,showImageSelect,imageData,showImageTextSelect,imageTextData
        } = this.state
        return (
            <React.Fragment>
                <Card title="" bordered={false}>

                    <Tabs activeKey={materiaType} onChange={this.tabChange} type="card">
                        <TabPane tab="图文消息" key="1">
                        {
                            showChoose&&imageTextData?(
                                <Space size="middle">  
                                    <div className="tabsChoose active">
                                        <div style={{marginTop:20,paddingLeft:20,paddingRight:20,textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>{imageTextData.publicImageTextList[0].title}</div>
                                        <img style={{marginTop:10}} height={200} width={200} src={imageTextData.publicImageTextList[0].pushImageUrl} alt="" />
                                        <div style={{marginTop:10}}>{imageTextData.createTime}</div>
                                    </div>
                                </Space>
                            ):
                            <Space size="middle">  
                                <div onClick={() => this.openImageTextSelect() } className="tabsChoose">
                                    <PlusOutlined  style={{marginTop:50,fontSize:40,color:'#ddd'}}/>
                                    <div style={{marginTop:15,fontSize:17,color:'#d6d6d6'}}>从素材库中选择</div>
                                </div>
                                <div className="tabsChoose">
                                    <PlusOutlined  style={{marginTop:50,fontSize:40,color:'#ddd'}}/>
                                    <div style={{marginTop:15,fontSize:17,color:'#d6d6d6'}}>新建图文消息</div>
                                </div>
                            </Space>
                        }  
                        </TabPane>
                        <TabPane tab="文字" key="0">
                            <div style={{marginLeft:16,marginRight:16,marginBottom:46}}>
                                <TextArea rows={8} onChange={this.textAreaChange} value={menuClicktext} maxLength="600" />
                            </div>
                        </TabPane>
                        <TabPane tab="图片" key="4">
                        {
                            showChoose&&imageData?(
                                <Space size="middle">  
                                    <div className="tabsChoose active">
                                        <div style={{marginTop:20,paddingLeft:20,paddingRight:20,textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>{imageData.resName}</div>
                                        <img style={{marginTop:10}} height={200} width={200} src={imageData.resUrl} alt="" />
                                        <div style={{marginTop:10}}>{imageData.resCreateTime}</div>
                                    </div>
                                </Space>
                            ):
                            <Space size="middle">  
                                <div onClick={() => this.openImageSelect() } className="tabsChoose">
                                    <PlusOutlined  style={{marginTop:50,fontSize:40,color:'#ddd'}}/>
                                    <div style={{marginTop:15,fontSize:17,color:'#d6d6d6'}}>从素材库中选择</div>
                                </div>
                                <div className="tabsChoose">
                                    <PlusOutlined  style={{marginTop:50,fontSize:40,color:'#ddd'}}/>
                                    <div style={{marginTop:15,fontSize:17,color:'#d6d6d6'}}>本地上传图片</div>
                                </div>
                            </Space>
                        } 
                        </TabPane>
                    </Tabs>
                </Card>
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
            </React.Fragment>
        )

    }
}