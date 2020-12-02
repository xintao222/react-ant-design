import React from 'react';
import { Space, Card, Table, DatePicker, ConfigProvider } from 'antd';
import moment from 'moment';
import locale from 'antd/es/locale/zh_CN';
import https from "../api/https";
import "../styles/statistics.css";
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

export default class MessageStatistics extends React.Component {
    
    state = {
        
        startDataTime: '',
        endDataTime: '',
        pageSize:10,
        pageTotal:0,
        list:[],
        columns:[
            {
                title: '发送时间',
                dataIndex: 'accessDate',
            },
            {
                title: '消息类型',
                dataIndex: 'msgType',
                render: msgType => (
                    <Space size="name">
                    {
                        msgType==0?(
                            <div>文本消息</div>
                        ):msgType==1?(
                            <div>图文消息</div>
                        ):msgType==2?(
                            <div>音频消息</div>
                        ):msgType==3?(
                            <div>视频消息</div>
                        ):'图片消息'
                    }
                    </Space>
                ),
            },
            {
                title: '文章标题',
                dataIndex: 'title',
            },
            {
                title: '发送状态',
                dataIndex: 'msgStatus',
                render: msgStatus => (
                    <Space size="name">
                    {
                        msgStatus==0?(
                            <div>未发送</div>
                        ):msgStatus==1?(
                            <div>已发送</div>
                        ):msgStatus==2?(
                            <div>发送成功</div>
                        ):msgStatus==3?(
                            <div>发送失败</div>
                        ):'发送超时'
                    }
                    </Space>
                ),
            },
            {
                title: '送达人数',
                dataIndex: 'successTotal',
            },
            {
                title: '图文阅读次数',
                dataIndex: 'visitorCount',
            },
            {
                title: '引导完成交易次数',
                dataIndex: 'guideCount',
            },
        ],
    };

    onChange = (date, dateString) =>{

        this.setState({ 
            startDataTime: dateString[0],
            endDataTime: dateString[1],
        },()=>{
            this.getListByCondition(1)
        });
    }

    getListByCondition = (index) =>{
        let params = {
            page: index - 1,
            pageSize: this.state.pageSize,
            publicId: '600000000070',
            startDataTime: this.state.startDataTime,
            endDataTime: this.state.endDataTime,
        };
        https.fetchGet("/analysis/message/getListByCondition", params)
        .then(data => {
            if (data.code == 200) {
                this.setState({
                    list: data.data.list,
                    pageTotal:data.data.page.count
                });
            }
        })
    }

    goPage = index => {
        this.getListByCondition(index);
    };

    componentWillMount() {
        
        let date = new Date();
        let year = date.getFullYear().toString();
        let mouth =
            date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1).toString()
            : (date.getMonth() + 1).toString();

        let day =
            date.getDate() + 1 < 10
            ? "0" + date.getDate().toString()
            : date.getDate().toString();
        let end = year + "-" + mouth + "-" + day;
        let begin = year + "-" + mouth + "-1";

        this.setState({ 
            startDataTime: begin,
            endDataTime: end,
        },()=>{
            this.getListByCondition(1);
        });
    }

    render() {
        const { 
            startDataTime,endDataTime,
            list,pageSize,pageTotal,columns
        } = this.state
        
        return (
            <Card title="消息统计" bordered={false}>
                <ConfigProvider locale={locale}>
                    <RangePicker defaultValue={[moment(startDataTime, dateFormat), moment(endDataTime, dateFormat)]} onChange={this.onChange} />
                </ConfigProvider>
                <Table
                    style={{marginTop:15}}
                    rowKey={(item) => item.id }
                    columns={columns}
                    dataSource={list}
                    pagination={{
                        total: pageTotal,
                        pageSize: pageSize,
                        onChange: this.goPage,
                        showSizeChanger:false
                    }}
                />
            </Card>
        )

    }
}