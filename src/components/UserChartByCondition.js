import React from 'react';
import ReactEcharts from "echarts-for-react";
import { DatePicker, Tabs, ConfigProvider } from 'antd';
import moment from 'moment';
import locale from 'antd/es/locale/zh_CN';
import https from "../api/https";
import "../styles/statistics.css";
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const dateFormat = 'YYYY/MM/DD';

export default class UserChartByCondition extends React.Component {
    
    state = {
        title:'新关注人数',
        type:0,
        startDataTime: '',
        endDataTime: '',
        option: {},
    };

    onChange = (date, dateString) =>{
        //console.log(date, dateString);
        this.setState({ 
            startDataTime: dateString[0],
            endDataTime: dateString[1],
        },()=>{
            this.getChartByCondition()
        });
    }
    
    callback = (key) =>{
        
        let title = '新关注人数';
        if(key==0) title = '新关注人数';
        if(key==1) title = '取消关注人数';
        if(key==2) title = '净增关注人数';
        if(key==3) title = '累计关注人数';
        this.setState({ 
            type: key,
            title: title
         },()=>{
            this.getChartByCondition()
         });
        
    }

    getChartByCondition = () =>{
        let params = {
            startDataTime: this.state.startDataTime,
            endDataTime: this.state.endDataTime,
            type: this.state.type,
            publicId: '600000000070'
        };
        https.fetchGet("/analysis/user/getChartByCondition", params)
        .then(data => {
            if (data.code === 200) {
                let rowX = [],rowY = [];
                for (var i = 0; i < data.data.length; i++) {
                    rowX.push(data.data[i].fouce_date);
                    rowY.push(data.data[i].count);
                }
                let option = {
                    color:['#1890ff'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: { data: [this.state.title] },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: { type: 'value' },
                    series: [
                        {
                            name: this.state.title,
                            type: 'line',
                            data: []
                        }
                    ]
                }
                option.xAxis.data = rowX;
                option.series[0].data = rowY;
                this.setState({ option });
            }
        })
    }

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
            this.getChartByCondition();
        });
    }

    render() {
        const { 
            startDataTime,endDataTime,
        } = this.state
        
        return (
            <section>
                <ConfigProvider locale={locale}>
                    <RangePicker defaultValue={[moment(startDataTime, dateFormat), moment(endDataTime, dateFormat)]} onChange={this.onChange} />
                </ConfigProvider>
                <Tabs onChange={this.callback} style={{marginTop:15}} type="card">
                    <TabPane tab="新关注人数" key="0" />
                    <TabPane tab="取消关注人数" key="1" />
                    <TabPane tab="净增关注人数" key="2" />
                    <TabPane tab="累计关注人数" key="3" />
                </Tabs>
                <ReactEcharts option={this.state.option}  key={Date.now()} />
            </section>
        )

    }
}