import React from 'react';
var echarts = require('echarts');
require('echarts/map/js/china');
require("echarts/theme/macarons.js");
export default React.createClass({
    getInitialState() {
        return {
            menuData: [],
            assetsData: {},
            investmentData: {},
            loading: false,
            monthBorrowAmt: [],
            monthBorrowCount: [],
            monthRegister: [],
            monthBorrowRepay: [],
            first: true
        }
    },
    fetch(data) {
        var me = this;
        var json1 = [];
        var json2 = [];
        var json3 = [];
        var json4 = [];
        for (let item1 in data.monthBorrowAmt) {
            json1.push({ 'name': item1, 'value': data.monthBorrowAmt[item1] });

        }
        for (let item2 in data.monthBorrowCount) {
            json2.push({ 'name': item2, 'value': data.monthBorrowCount[item2] });
        }
        for (let item3 in data.monthRegister) {
            json3.push({ 'name': item3, 'value': data.monthRegister[item3] });
        }
        for (let item4 in data.monthBorrowRepay) {
            json4.push({ 'name': item4, 'value': data.monthBorrowRepay[item4] });
        }
        me.setState({
            monthBorrowAmt: json1,
            monthBorrowCount: json2,
            monthRegister: json3,
            monthBorrowRepay: json4,
            first: false
        },() => {
            me.drawMap();
        });
        

    },
    drawMap() {
        var me = this;
        var map = echarts.init(document.getElementById('map'), 'macarons');

        var mapOption = {
            title: {
                text: '用户地域分布',
                subtext: '',
                left: 'center',
                y: 10,
                textStyle: {
                    color: '#666',
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    var province = params.name;
                    if (!province) {
                        province = '南沙群岛';
                    }
                    var res = province + '</br>';
                    var series = mapOption.series;
                    var monad;
                    for (var j = 0; j < series.length; j++) {
                        for (var i = 0; i < series[j].data.length; i++) {
                            if (series[j].data[i].name == province) {
                                switch (series[j].name) {
                                    case '当月融资金额': monad = '元'; break;
                                    case '当月借款笔数': monad = '笔'; break;
                                    case '当月新增用户': monad = '个'; break;
                                    case '当月还款金额': monad = '元'; break;
                                    default: monad = ''; break;
                                }
                                res += series[j].name + ': ' + (series[j].data[i] && series[j].data[i].value ? series[j].data[i].value : 0) + monad + '<br/>';
                            }
                        }
                    }
                    return res;
                },
                textStyle: {
                    align: 'left'
                }
            },
            legend: {
                orient: 'vertical',
                left: '20',
                top: '20',
                data: ['当月融资金额', '当月借款笔数', '当月新增用户', '当月还款金额']
            },
            toolbox: {
                show: true,
                orient: 'horizontal',
                right: '20',
                top: '20',
                feature: {
                    restore: {title : '刷新'},
                    saveAsImage: {}
                }
            },
            series: [
                {
                    name: '当月融资金额',
                    type: 'map',
                    mapType: 'china',
                    roam: false,
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: me.state.monthBorrowAmt
                },
                {
                    name: '当月借款笔数',
                    type: 'map',
                    mapType: 'china',
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: me.state.monthBorrowCount
                },
                {
                    name: '当月新增用户',
                    type: 'map',
                    mapType: 'china',
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: me.state.monthRegister
                },
                {
                    name: '当月还款金额',
                    type: 'map',
                    mapType: 'china',
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: me.state.monthBorrowRepay
                }
            ]
        };
        map.setOption(mapOption);
    },
    componentWillReceiveProps(nextProps) {
		if(nextProps.data.constructor == Object && this.state.first){
            this.fetch(nextProps.data);
        }
        
    },
    render() {
        return <div id="map" style={{ height: '400px', width: '750px', margin: '0 auto' }}></div>
    }
});