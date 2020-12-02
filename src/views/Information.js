import React from 'react';
import { Card,Button } from 'antd';
import https from "../api/https";
import "../styles/information.css";
export default class Information extends React.Component {
    
    state = {
        serviceInfo: {
            introduce:'',
            keywords:'',
            qrcodeurl:'',
            sendFlag:{
                setStatus:null
            },
            titleFlag:{
                setStatus:null
            },
            menuFlag:{
                setStatus:null
            },
            recommendFlag:{
                setStatus:null
            },
            messageUpperLimit:{
                setHz:null
            },
        }
    };

    download(url,width) {
        
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let img = new Image()
        img.crossOrigin = 'anonymous' //允许跨域
        img.src = url
        img.onload = function() {
            canvas.height = width
            canvas.width = width
            ctx.drawImage(img, 0, 0, width, width)
            let dataURL = canvas.toDataURL('image/png');
            let link = document.createElement('a')
            link.href = dataURL
            link.download = 'qrCode.png'
            link.click()
        }
    }
    
    componentWillMount() {
        let params = {
            id: 600000000026
        };
        https.fetchGet("/serviceAccount/selectAccount", params)
        .then(data => {
            if (data.code === 200) {
                this.setState({
                    serviceInfo: data.data,
                });
            }
        })
    }
    render() {
        const { serviceInfo } = this.state
        return (
            <Card title="基本信息" bordered={false}>
                <div className="card-item"> 
                    <label>{serviceInfo.name}</label>
                    <img height={80} width={80} src={serviceInfo.portrait ? serviceInfo.portrait.resUrl : ''} />
                </div>
                <div className="card-item"> 
                    <label>服务号介绍：</label>
                    <span>{serviceInfo.introduce}</span>
                </div>
                <div className="card-item"> 
                    <label>搜索词条：</label>
                    <span>{serviceInfo.keywords}</span>
                </div>
                <div className="card-item"> 
                    <label>支持主动消息推送：</label>
                    <span>{serviceInfo.sendFlag ? (serviceInfo.sendFlag.setStatus==1 ? "是" : "否") : ""}</span>
                    <span style={{ padding: 50}}></span>
                    <label>同步千人千面标签：</label>
                    <span>{serviceInfo.titleFlag ? (serviceInfo.titleFlag.setStatus==1 ? "是" : "否") : ""}</span>
                </div>
                <div className="card-item"> 
                    <label>支持自定义菜单：</label>
                    <span>{serviceInfo.menuFlag ? (serviceInfo.menuFlag.setStatus==1 ? "是" : "否") : ""}</span>
                    <span style={{ padding: 50}}></span>
                    <label>&emsp;在搜索页推荐展示：</label>
                    <span>{serviceInfo.recommendFlag ? (serviceInfo.recommendFlag.setStatus==1 ? "是" : "否") : ""}</span>
                </div>
                <div className="card-item"> 
                    <label>客户每月接收数量上限：</label>
                    <span>{serviceInfo.messageUpperLimit? (serviceInfo.messageUpperLimit.setHz ? serviceInfo.messageUpperLimit.setHz : 0) : ""}</span>
                </div>
                <div className="card-item"> 
                    <label>服务号二维码：</label>
                    <img width={300} src={serviceInfo.qrcodeurl} />
                </div>
                <div className="card-item"> 
                    <label >服务号二维码：</label>&emsp;&emsp;
                    <Button 
                        size={'large'} 
                        type="primary"
                        onClick={this.download.bind(serviceInfo.qrcodeurl,300)}
                    >下载(300*300像素)</Button>&emsp;&emsp;
                    <Button 
                        size={'large'} 
                        type="primary"
                        onClick={this.download.bind(serviceInfo.qrcodeurl,500)}
                    >下载(500*500像素)</Button>&emsp;&emsp;
                    <Button 
                        size={'large'} 
                        type="primary"
                        onClick={this.download.bind(serviceInfo.qrcodeurl,1000)}
                    >下载(1000*1000像素)</Button>
                </div>
            </Card>
        )

    }
}