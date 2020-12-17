import React from 'react';
import { message, Card, Row, Col, Button, Radio, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import https from "../api/https";
import TabsBox from '../components/TabsBox'
import "../styles/customizeMenu.css";

export default class CustomizeMenu extends React.Component {
    
    state = {
        imgIop:require('../styles/img/top.png'),
        imgBot:require('../styles/img/bottom.png'),
        list:[],
        parentIndex:0,
        sonIndex:-1,
        menuId:0,
        sonMenu:{
            menuName: '',
            menuType: 0,
            menuUrl: ''
        },
        isDisable: false,
    }

    onRadioChange = e => {
        let sonMenu = this.state.sonMenu;
        sonMenu.menuType = e.target.value;
        this.setState({
            sonMenu
        });
    };

    onMenuChange = e => {
        let sonMenu = this.state.sonMenu;
        sonMenu.menuName = e.target.value;
        this.setState({
            sonMenu
        });
    };

    onUrlChange = e => {
        let sonMenu = this.state.sonMenu;
        sonMenu.menuUrl = e.target.value;
        this.setState({
            sonMenu
        });
    };

    addParent = () => {
        let list = this.state.list;
        let menuId = this.state.menuId;
        menuId--;
        list.push({
            menuName: "菜单",
            parId: 0,
            menuId: menuId,
            nodes: []
        });
        this.setState({ 
            list,
        });
    }

    addSon = (item,index,e) => {
        let list = this.state.list;
        let menuId = this.state.menuId;
        menuId--;
        list[index].nodes.push({
            menuName: item.menuName + "子菜单",
            parId: item.menuId,
            menuId: menuId,
            materiaType: 1,
        });
        this.setState({ 
            list,
        });
    }

    getMenuItem = (item,index) => {

        if( item.nodes.length != 0){
            item.menuType = 2;
        }else{
            if(!item.menuType) item.menuType = 0;
        }
        let menuId = this.state.menuId
        if (item.menuId > 0) {
            menuId = 0;
        } else if (item.menuId < 0) {
            menuId--;
        }
        this.setState({
            parentIndex: index,
            sonIndex: -1,
            menuId: menuId,
            sonMenu: item,
        },()=>{
            if(!item.materiaType && item.materiaType!=0 ) item.materiaType = 1;
            if(item.menuType == 0) this.refs.tabsBox.setData(item);
        });
    };

    getSonItem = (item,index,e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        if(!item.materiaType) item.materiaType = 0
        if(!item.menuType) item.menuType = 0
        
        this.setState({
            sonIndex: index,
            sonMenu: item,
        },()=>{
            if(item.menuType == 0) this.refs.tabsBox.setData(item);
        });
        
    };

    getMenuList = () => {
        let params = {};
        https.fetchGet("/publicMenu/selectAllMenu", params).then(data => {
            if (data.code === 200) {
                this.setState({
                    list: data.data,
                });
            }
        })
    };

    submit = () => {

        let publishStatus = false;
        let item = this.state.sonMenu;
        let menuType = this.state.sonMenu.menuType;
        let params = {},materiaType,materialId,menuClicktype,menuClicktext,menuUrl;
        if (menuType == 0) {
            let tabs = this.refs.tabsBox.state;
            if (tabs.materiaType == 0) { //文字
                materiaType = tabs.materiaType;
                materialId = 0;
                menuClicktype = 1;
                menuClicktext = tabs.menuClicktext;
                menuUrl = "";
                if(menuClicktext) publishStatus = true;
            } else if (tabs.materiaType == 1 || tabs.materiaType == 4) { //图文、图片
                materiaType = tabs.materiaType;
                materialId = tabs.materialId;
                menuClicktype = 0;
                menuClicktext = "";
                menuUrl = "";
                if(materialId) publishStatus = true;
            }
        } else if (menuType == 1) {
            materiaType = item.materiaType;
            materialId = 0;
            menuClicktype = null;
            menuClicktext = "";
            menuUrl = item.menuUrl;
            if(menuUrl) publishStatus = true;
        } else if (menuType == 2) {
            materiaType = item.materiaType;
            materialId = item.materialId;
            menuClicktype = item.menuClicktype;
            menuClicktext = item.menuClicktext;
            menuUrl = "";
            publishStatus = true;
        }
        params = {
            publicId: 600000000002,
            menuStatu: 0,
            needauthorization: 1,
            menuName: item.menuName,
            menuType: item.menuType, //0/1/2=素材/链接/无
            materialId: materialId,
            materiaType: materiaType,
            menuClicktype: menuClicktype,
            menuClicktext: menuClicktext,
            menuUrl: menuUrl, //链接-链接
            parId: item.parId, //父id
            menuId: item.menuId && item.menuId >= 0 ? item.menuId : null
        };
        //console.log(params)
        if(
            //params.menuId != null &&
            publishStatus == true &&
            params.menuName != ""
        ){
            this.setState({ isDisable: true });
            https.fetchPost("/publicMenu/addMenu", params)
            .then(data => {
                this.setState({ isDisable: false });
                if (data.code === 200){
                    message.success( item.menuId && item.menuId >= 0? "修改成功!" : "添加成功!");
                    setTimeout(()=>{
                        window.location.reload();
                    },1200)
                } 
                else message.info( item.menuId && item.menuId >= 0? "修改失败!" : "添加失败!");
            })
        }else{
            message.info("菜单信息填写有误！请重新输入");
        }

    };

    componentDidMount(){
        this.getMenuList();
    }
    
    render() {
        const { 
            imgIop,imgBot,list,parentIndex,sonIndex,sonMenu,isDisable
        } = this.state
        return (
            <Card title="自定义菜单" className="add" bordered={false}>
                <Row>
                    <Col flex="320px" className="cusLeft">
                        <div className="cusMenu">
                            <img className="imgIop" src={imgIop} />
                            <img className="imgBot" src={imgBot} />
                            <div className="imgMid"></div>
                            <div className="textBot">
                            {
                                list.map((item,index)=>{
                                    return(
                                        <div
                                            className={parentIndex==index?"textItem active":"textItem"} 
                                            key={index}
                                            onClick={() => this.getMenuItem(item,index)}
                                        >
                                            {item.menuName}
                                            
                                            {
                                                parentIndex==index?(
                                                    <React.Fragment>
                                                    <div className="arrow"></div>
                                                    {
                                                        item.nodes.length<5?(
                                                            <div className="sonAdd" onClick={(e) => this.addSon(item,index,e)} >
                                                                <PlusOutlined />
                                                            </div>
                                                        ):''
                                                    }
                                                    {
                                                        item.nodes&&item.nodes.length?(
                                                            <div
                                                                className={item.nodes.length==5?"sonBox active":"sonBox"} 
                                                            >
                                                                {
                                                                    item.nodes.map((sonItem,idx)=>{
                                                                        return(
                                                                            <div
                                                                                className={sonIndex==idx?"sonItem active":"sonItem"} 
                                                                                key={idx}
                                                                                onClick={(e) => this.getSonItem(sonItem,idx,e)}
                                                                            >{sonItem.menuName}
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        ):''
                                                    }
                                                    </React.Fragment>
                                                ):''
                                            }
                                        </div>
                                    )
                                })
                            }
                            {
                                list.length<3?(
                                    <div className="textItem" onClick={this.addParent} >
                                        <PlusOutlined />
                                    </div>
                                ):''
                            }
                            </div>
                        </div>
                    </Col>
                    <Col flex="auto" className="cusRight">
                        <div className="cusHeader">
                            <Button type="link" >删除子菜单</Button>
                        </div>
                        <div style={{marginBottom:20}}>
                            <label>子菜单名称：</label>
                            <Input style={{width:360}} onChange={this.onMenuChange} value={sonMenu.menuName} placeholder="请输入内容" /><br />
                            <label>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                <span style={{display:'inline-block',fontSize:16,color: "rgb(154, 141, 141)",marginTop:15}}>字数不超过8个汉字或16个字符</span>
                            </label>
                        </div>
                        {
                            sonMenu.menuType!=2?(
                                <div style={{marginBottom:20}}>
                                    <label>子菜单内容：</label>
                                    <Radio.Group onChange={this.onRadioChange} value={sonMenu.menuType || 0} >
                                        <Radio value={0}>发送消息</Radio>
                                        <Radio value={1}>跳转网页</Radio>
                                    </Radio.Group>
                                </div>
                            ):''
                        }
                        {
                            (sonMenu.menuType==0 && sonMenu.menuType!=2)?(
                                <TabsBox ref="tabsBox" />
                            ):''
                        }
                        {
                            (sonMenu.menuType==1 && sonMenu.menuType!=2)?(
                                <div style={{background:'#fff',padding:20}}>
                                    <p style={{color: "rgb(154, 141, 141)"}}>订阅者点击该子菜单会跳到以下链接</p>
                                    <div style={{marginBottom:24}}>
                                        <label>页面地址：</label>
                                        <Input style={{width:360}} onChange={this.onUrlChange} value={sonMenu.menuUrl} placeholder="请输入内容" />
                                    </div>
                                </div>
                            ):''
                        }
                    </Col>
                </Row>
                <div style={{fontSize:16,marginTop:20,paddingLeft:340}}>
                    <Button type="primary" disabled={isDisable} onClick={this.submit} >保存</Button>
                </div>
            </Card>
        )

    }
}