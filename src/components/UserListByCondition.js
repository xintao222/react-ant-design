import React from 'react';
import { Table, DatePicker, ConfigProvider } from 'antd';
import moment from 'moment';
import locale from 'antd/es/locale/zh_CN';
import https from "../api/https";
import "../styles/statistics.css";
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

export default class UserListByCondition extends React.Component {
    
    state = {
        
        startDataTime: '',
        endDataTime: '',
        pageSize:10,
        pageTotal:0,
        list:[],
        columns:[
            {
                title: '时间',
                dataIndex: 'fouceDate',
            },
            {
                title: '新关注人数',
                dataIndex: 'fouceCount',
            },
            {
                title: '取消关注人数',
                dataIndex: 'unfouceCount',
            },
            {
                title: '净增关注人数',
                dataIndex: 'fouceUnique',
            },
            {
                title: '累计关注人数',
                dataIndex: 'totalCount',
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
        https.fetchGet("/analysis/user/getListByCondition", params)
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
            <section>
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
            </section>
        )

    }
}