import React from 'react';
import { message, Card, Row, Col, Button, Checkbox, Input, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TinyMce from '../components/TinyMce'
import ImageSelect from '../components/ImageSelect'
import VideoSelect from '../components/VideoSelect'
import https from "../api/https";
import "../styles/addImageText.css";
const { TextArea } = Input;

export default class EditImageText extends React.Component {
    
    state = {
        disabled:false,
        showImageSelect:false,
        showVideoSelect:false,
        imagetxtlist: [
            {
                title: "",
                content: "",
                imageTextId: 0,
                key: "pushlist0",
                resId: 0,
                summary: "",
                coverPicShowInContent: 0,
                link: "",
                commentFlag: "Y",
                pushImageUrl: ""
            },
        ],
        images:{}
    }
    onEdit = (images,index) => {
        let imagetxtlist = this.state.imagetxtlist;
        imagetxtlist[index] = images;
        this.setState({ images,imagetxtlist });
        setTimeout(()=>{
            this.refs.tinymce.setContent(images.content);
        },10)
    }
    adds = () => {
        let imagetxtlist = this.state.imagetxtlist;
        let images = {
            title: "",
            content: "",
            imageTextId: 0,
            key: "pushlist" + this.state.imagetxtlist.length,
            resId: 0,
            summary: "",
            coverPicShowInContent: 0,
            link: "",
            commentFlag: "Y",
            pushImageUrl: ""
        }
        imagetxtlist.push(images);
        this.setState({ 
            imagetxtlist,
            images
        });
        setTimeout(()=>{
            this.refs.tinymce.setContent(images.content);
        },10)
    }
    onDelete = (index) => {
        let imagetxtlist = this.state.imagetxtlist;
        imagetxtlist.splice(index, 1);
        
        this.setState({ imagetxtlist });
        if (imagetxtlist.length == 1) {
            this.setState({ 
                images: this.state.imagetxtlist[0]
            });
        }
        setTimeout(()=>{
            this.refs.tinymce.setContent(imagetxtlist[imagetxtlist.length-1].content);
        },10)
    }
    textAreaChange = ({ target: { value } }) => {
        let images = this.state.images
        images.summary = value;
        this.setState({ images });
    }
    titleChange = ({ target: { value } }) => {
        let images = this.state.images
        images.title = value;
        this.setState({ images });
    }
    linkChange = ({ target: { value } }) => {
        let images = this.state.images
        images.link = value;
        this.setState({ images });
    }

    checkedChange = (e) => {
        let commentFlag;
        if (e.target.checked == false) commentFlag = "N";
        if (e.target.checked == true) commentFlag = "Y";
        let images = this.state.images;
        images.commentFlag = commentFlag;
        this.setState({ images });
    }

    setarticleContentHandle = (content) => {
        let images = this.state.images
        images.content = content;
        this.setState({ images });
    }

    openImageSelect = imageType => {
        this.setState({
            imageType: imageType,
            showImageSelect: true,
        });
    }

    openVideoSelect = () => {
        this.setState({
            showVideoSelect: true,
        });
    }

    ComfirmImage = imageSelection => {
        if(imageSelection){
            //选择图片处理
            if(this.state.imageType=='image'){
                if (imageSelection.resUrl) {
                    let value = '<p style="height:auto;text-align:center;overflow:auto"><img style="max-width:100%;height:auto;" src=' + imageSelection.resUrl + ' ></p>'
                    window.tinymce.activeEditor.execCommand('mceInsertContent', false, value );
                    
                    let images = this.state.images
                    images.content = window.tinymce.activeEditor.getContent();
                    this.setState({ images });
                }
            }
            //选择封面处理
            if(this.state.imageType=='material'){
                let images = this.state.images;
                if(imageSelection.resId) images.resId = imageSelection.resId;
                if(imageSelection.resUrl) images.pushImageUrl = imageSelection.resUrl;
                this.setState({ images });
            }
            this.setState({ showImageSelect: false });
        }
        else this.setState({ showImageSelect: false, })
    }

    
    ComfirmVideo = (item) => {
        console.log(item)
        if(item){
            this.videoHandler(item.resUrl)
            this.setState({ showVideoSelect: false, })
        }
        else this.setState({ showVideoSelect: false, })
    };

    videoHandler = (url) => {
        
        let video = document.createElement('video')
        video.preload = 'metadata'
        video.src = url
        video.onloadedmetadata = () => {
            
            let videoUrl =  '<video height="'+video.videoHeight+'" width="'+video.videoWidth+'" style="max-height:434px;max-width:100%;" controls="controls">\n' + 
                                '<source src="' + url + '" />\n' + 
                            '</video>';
            let value = '<p style="height:auto;text-align:center;overflow:auto">'+videoUrl+'</p>';
            window.tinymce.activeEditor.execCommand('mceInsertContent', false, value );
            
            let images = this.state.images
            images.content = window.tinymce.activeEditor.getContent();
            this.setState({ images });
        }
    }

    submit = () => {
        let imagetxtlist = this.state.imagetxtlist;
        for (let items of imagetxtlist) {
            if (items.title == "") {
                message.info("保存失败，请输入标题");
                return;
            } else if (items.content == "") {
                message.info("保存失败，请输入文本");
                return;
            } else if (items.resId == 0) {
                message.info("保存失败，请选择封面图");
                return;
            } else if (items.resId == null) {
                message.info("保存失败，请选择封面图");
                return;
            } else if (items.summary == "") {
                message.info("保存失败，请输入摘要");
                return;
            }
        }
        //开始可以点击
        this.setState({ disabled: true });
        //开始转码
        const newMaterialImageTexts = [];
        for (let images of imagetxtlist) {
            newMaterialImageTexts.push({
                title: encodeURIComponent(
                    images.title.replace(/"/g, "'").replace(/\\/g, "\\\\")
                ),
                content: encodeURIComponent(
                    images.content
                    .replace(/&amp;/g, "&")
                    .replace(/"/g, "'")
                    .replace(/\\/g, "\\\\")
                ),
                imageTextId: images.imageTextId,
                key: images.key,
                resId: images.resId,
                summary: encodeURIComponent(
                    images.summary.replace(/"/g, "'").replace(/\\/g, "\\\\")
                ),
                coverPicShowInContent: images.coverPicShowInContent,
                link: images.link,
                commentFlag: images.commentFlag
            });
        }
        
        let params = {
            oldMaterialId: window.imagetextList.materialId || 0,
            newMaterialImageTexts: newMaterialImageTexts
        };
        //console.log(params)
        https.fetchPost("/material/imagetext/uploadMultiple", params)
        .then(data => {
            if (data.code == 200) {
                message.success("保存成功");
                this.props.history.push(`/materialManager`);
            } else {
                message.success("保存失败");
                this.setState({ disabled: false });
            }
        })
    }

    componentWillMount(){
        const imagetxtlist = [];
        if(window.imagetextList){
            for (let i = 0; i < window.imagetextList.publicImageTextList.length; i++) {
                let item = window.imagetextList.publicImageTextList[i];
                imagetxtlist.push({
                    title: item.title.replace( /&quot;/g,"'" ),
                    content: item.content.replace( /&quot;/g,"'" ),
                    imageTextId: 0,
                    key: "pushlist" + [i],
                    resId: item.resId,
                    summary: item.summary.replace( /&quot;/g,"'" ),
                    coverPicShowInContent: 0,
                    linkUrl: item.linkUrl,
                    commentFlag: item.commentFlag,
                    pushImageUrl: item.pushImageUrl
                });
            }
            this.setState({ 
                imagetxtlist: imagetxtlist
            });
        } 
    }

    componentDidMount(){
        this.setState({ 
            images: this.state.imagetxtlist[0]
        });
    }
    
    render() {
        const { 
            imagetxtlist,images,showImageSelect,showVideoSelect
        } = this.state
        return (
            <Card title="新建图文消息" className="add" bordered={false}>
                <Row>
                    <Col flex="230px" className="colLeft">
                        <div className="title">图文列表</div>
                        {
                            imagetxtlist.map((item,index)=>{
                                if(index == 0){
                                    return(
                                        <div 
                                            className="images"
                                            key={index}
                                            onClick={() => this.onEdit(item,index)}
                                        >
                                            {
                                                item.pushImageUrl?(
                                                    <img className="img" src={item.pushImageUrl}/>
                                                ):''
                                            }
                                            {
                                                item.title?(
                                                    <div className="imgTitle">{item.title}</div>
                                                ):''
                                            } 
                                        </div>
                                    )
                                }else{
                                    return(
                                        <div 
                                            className="images pd"
                                            key={index}
                                        >
                                            {
                                                item.pushImageUrl?(
                                                    <img className="img" src={item.pushImageUrl}/>
                                                ):''
                                            }
                                            {
                                                item.title?(
                                                    <div className="imgTitle">{item.title}</div>
                                                ):''
                                            }
                                            <div className="box">
                                                <Button type="primary" onClick={() => this.onEdit(item,index)} style={{marginRight:10}} size="small">编辑</Button>
                                                <Button type="primary" onClick={() => this.onDelete(index)} danger size="small">删除</Button>
                                            </div>
                                        </div>
                                    )
                                }
                                    
                            })
                        }
                        <div className="adds" onClick={this.adds}>
                            <PlusOutlined  style={{marginTop:10,fontSize:30,color:'rgb(140, 147, 157)'}}/>
                        </div>
                    </Col>
                    <Col flex="auto" className="colRight">
                        <div className="titleRight">图文内容
                            <Button type="primary"
                                className="fRight"
                                onClick={() => this.openVideoSelect()}
                            >选择视频</Button>
                            <Button type="primary"
                                className="fRight"
                                style={{marginRight:15}}
                                onClick={() => this.openImageSelect('image')}
                            >选择图片</Button>
                        </div>
                        <Input onChange={this.titleChange} value={images.title} placeholder="请输入标题" />
                        <TinyMce 
                            ref="tinymce"
                            setarticleContentHandle={(value) => this.setarticleContentHandle(value)} 
                            detail={images.content}
                        ></TinyMce>
                        <br />
                        <div className="titleRight">封面</div>
                        <Button type="primary"
                            onClick={() => this.openImageSelect('material')}
                        >从素材中选择</Button>
                        <div style={{fontSize:16,marginTop:15}}>摘要</div>
                        <TextArea rows={15} onChange={this.textAreaChange} value={images.summary} maxLength="256" />

                        
                        <div style={{fontSize:16,marginTop:15}}>
                            是否启用评论&ensp;
                            <Checkbox
                                checked={images.commentFlag=="Y"}
                                onChange={this.checkedChange}
                            ></Checkbox>
                        </div>
                        
                        <div style={{fontSize:16,marginTop:15}}>
                            原文链接：
                        </div>
                        <Input onChange={this.linkChange} value={images.link} placeholder="" />
                        <div style={{fontSize:16,marginTop:25}}>
                            <Button type="primary"
                                onClick={this.submit}
                            >保存</Button>
                        </div>
                        
                    </Col>
                </Row>
                {
                    showImageSelect?(
                        <ImageSelect ComfirmSelect={this.ComfirmImage} />
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