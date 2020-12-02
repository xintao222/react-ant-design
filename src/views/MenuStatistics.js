import React from 'react';
import { Card, } from 'antd';
import MenuListByCondition from '../components/MenuListByCondition'
import MenuChartByCondition from '../components/MenuChartByCondition'
import https from "../api/https";
import "../styles/statistics.css";

export default class MenuStatistics extends React.Component {
    
    state = {
        list:{}
    };

    getYesterDayKeyIndicator = (index) =>{
        let params = {
            publicId: '600000000070',
        };
        https.fetchGet("/analysis/menu/getYesterDayKeyIndicator", params)
        .then(data => {
            if (data.code == 200) {
                this.setState({
                    list: data.data
                });
            }
        })
    }

    componentWillMount() {
        this.getYesterDayKeyIndicator();
    }

    render() {
        const { 
            list
        } = this.state
        
        return (
            <Card title="菜单分析" bordered={false}>
                <div>
                    昨日关键指标
                </div>
                <div className="list">
                    <div className="item">
                        <div className="label">
                            <h3>菜单点击次数</h3>
                            <p style={{marginBottom:'.5em'}}>{list.menuTotalCount}</p>
                        </div>
                        <div className="label">
                            <span>日</span>
                            {Math.sign(list.menuTotalDailyCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.menuTotalDailyCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.menuTotalDailyCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.menuTotalDailyCount)}%</span>
                        </div>
                        <div className="label">
                            <span>周</span>
                            {Math.sign(list.menuTotalWeekCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.menuTotalWeekCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.menuTotalWeekCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.menuTotalWeekCount)}%</span>
                        </div>
                        <div className="label">
                            <span>月</span>
                            {Math.sign(list.menuTotalMonthlyCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.menuTotalMonthlyCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.menuTotalMonthlyCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.menuTotalMonthlyCount)}%</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="label">
                            <h3>菜单点击人数</h3>
                            <p style={{marginBottom:'.5em'}}>{list.totalCount}</p>
                        </div>
                        <div className="label">
                            <span>日</span>
                            {Math.sign(list.totalDailyCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.totalDailyCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.totalDailyCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.totalDailyCount)}%</span>
                        </div>
                        <div className="label">
                            <span>周</span>
                            {Math.sign(list.totalWeekCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.totalWeekCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.totalWeekCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.totalWeekCount)}%</span>
                        </div>
                        <div className="label">
                            <span>月</span>
                            {Math.sign(list.totalMonthlyCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.totalMonthlyCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.totalMonthlyCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.totalMonthlyCount)}%</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="label">
                            <h3>人均点击次数</h3>
                            <p style={{marginBottom:'.5em'}}>{list.avgTotalCount}</p>
                        </div>
                        <div className="label">
                            <span>日</span>
                            {Math.sign(list.avgTotalDailyCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.avgTotalDailyCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.avgTotalDailyCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.avgTotalDailyCount)}%</span>
                        </div>
                        <div className="label">
                            <span>周</span>
                            {Math.sign(list.avgTotalWeekCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.avgTotalWeekCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.avgTotalWeekCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.avgTotalWeekCount)}%</span>
                        </div>
                        <div className="label">
                            <span>月</span>
                            {Math.sign(list.avgTotalMonthlyCount) > 0?(
                                <i className="icon_up" title="上升"></i>
                            ):''}
                            {Math.sign(list.avgTotalMonthlyCount) < 0?(
                                <i className="icon_down" title="下降"></i>
                            ):''}
                            {Math.sign(list.avgTotalMonthlyCount) == 0?(
                                <i className="icon_balance" title="平衡"></i>
                            ):''}
                            <span>{Math.abs(list.avgTotalMonthlyCount)}%</span>
                        </div>
                    </div>
                </div>
                <MenuChartByCondition />
                <MenuListByCondition />
            </Card>
        )

    }
}