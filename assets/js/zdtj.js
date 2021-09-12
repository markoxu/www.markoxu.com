var figure0 = echarts.init(document.getElementById('figure0'));
var figure1 = echarts.init(document.getElementById('figure1'));
var figure2 = echarts.init(document.getElementById('figure2'));

$.get('../../../assets/data/zdtj.json', function (stock) {
    /* figure0 zdzs */
    var znum = stock['zdfb']['znum'];
    var dnum = stock['zdfb']['dnum'];
    var option = {
        title: {
            text: `上涨家数${znum}，下跌家数${dnum}\n更新时间：${stock['time']}`,
            left: 'center',
            textStyle: {color: '#999', fontWeight: 'normal', fontSize: 14}
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {type: 'shadow'}
        },
        toolbox: {
            show: true,
            itemSize: 20,
            feature: {saveAsImage: {title: "保存", pixelRatio: 2, name: "涨跌指数"}}
        },
        graphic: [{
            type: 'group',
            rotation: Math.PI / 4,
            bounding: 'raw',
            right: 50,
            bottom: 50,
            z: 100,
            children: [{
                type: 'rect',
                left: 'center',
                top: 'center',
                z: 100,
                shape: {width: 400, height: 50},
                style: {fill: 'rgba(0, 0, 0, 0.2)'}
            }, {
                type: 'text',
                left: 'center',
                top: 'center',
                z: 100,
                style: {fill: 'rgba(255, 255, 255, 0.3)', text: 'MARKOXU.COM', font: 'bold 15px sans-serif'}
            }]
        }],
        grid: {top: '10%', right:'5%', bottom: '0', left:'5%', containLabel: true},
        xAxis: {
            type: 'value',
            axisLabel: {formatter: '{value}%'}
        },
        yAxis: {
            type: 'category',
            data: stock['zdzs']['name'].reverse()
        },
        series: [{
            type: 'bar',
            data: stock['zdzs']['value'].reverse(),
            itemStyle: {
                normal: {
                    color: function(params) {return params.value < 0? '#59b881' : '#d75442';},
                    label: {
                        show: true,
                        formatter(params) {return params.value + '%';}
                    }
                }
            },
        }]
    };
    figure0.setOption(option);

    /* figure1 zdfb */
    var zdbar = ['-10%','-8%','-6%','-4%','-2%','0%','2%','4%','6%','8%','10%'];
    var znum = stock['zdfb']['znum'];
    var dnum = stock['zdfb']['dnum'];
    var option = {
        title: {
            text: `上涨家数${znum}，下跌家数${dnum}\n更新时间：${stock['time']}`,
            left: 'center',
            textStyle: {color: '#999', fontWeight: 'normal',fontSize: 14}
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {type: 'shadow'},
            formatter(params) {
                if(params[0] != undefined && params[0].name.length != 0) {
                    return `<div class="tooltip-title">
                            <div>${zdbar[params[0].dataIndex]}~${zdbar[params[0].dataIndex+1]}</div>
                            <div><span style="width:10px;height:10px;display:inline-block;background:${params[0].color}"></span> ${params[0].data}</div>
                            </div>`;
                }
            }
        },
        toolbox: {
            show: true,
            itemSize: 20,
            feature: {saveAsImage: {title: "保存", pixelRatio: 2, name: "涨跌分布"}}
        },
        graphic: [{
            type: 'group',
            rotation: Math.PI / 4,
            bounding: 'raw',
            right: 50,
            bottom: 50,
            z: 100,
            children: [{
                type: 'rect',
                left: 'center',
                top: 'center',
                z: 100,
                shape: {width: 400, height: 50},
                style: {fill: 'rgba(0, 0, 0, 0.2)'}
            }, {
                type: 'text',
                left: 'center',
                top: 'center',
                z: 100,
                style: {fill: 'rgba(255, 255, 255, 0.3)', text: 'MARKOXU.COM', font: 'bold 15px sans-serif'}
            }]
        }],
        grid: {top: '15%', right:'5%', bottom: '0', left:'5%', containLabel: true},
        xAxis: [{
            data: stock['zdfb']['zd_num'],
            show:false,
        }, {
            axisPointer: {show: false},
            boundaryGap: false,
            position: 'bottom',
            data: zdbar,
        }],
        yAxis: {
            type: 'value',
            minInterval: 500
        },
        series: [{
            type: 'bar',
            data: stock['zdfb']['zd_num'],
            itemStyle: {
                normal: {
                    color: function(params) {return params.dataIndex < 5? '#59b881' : '#d75442';},
                    label: {show: true, position: 'top'}
                }
            }
        }]
    };
    figure1.setOption(option);

    /* figure2 zdts */
    var xbar = new Array(245);
    xbar[0] = "09:25";
    xbar[xbar.length - 1] = "15:00";
    for(var i = 0; i < stock['zdts']['zd_time'].length; i++) {
        xbar[i] = stock['zdts']['zd_time'][i];
    }
    var ztzs = stock['zdts']['ztzs'][stock['zdts']['ztzs'].length-1];
    var dtzs = stock['zdts']['dtzs'][stock['zdts']['dtzs'].length-1];
    var option = {
        title: {
            text: `涨停家数${ztzs}，跌停家数${dtzs}\n更新时间：${stock['time']}`,
            left: 'center',
            textStyle: {color: '#999', fontWeight: 'normal',fontSize: 14}
        },
        tooltip: {trigger: 'axis'},
        toolbox: {
            show: true,
            itemSize: 20,
            feature: {saveAsImage: {title: "保存", pixelRatio: 2, name: "涨跌停数"}}
        },
        graphic: [{
            type: 'group',
            rotation: Math.PI / 4,
            bounding: 'raw',
            right: 50,
            bottom: 50,
            z: 100,
            children: [{
                type: 'rect',
                left: 'center',
                top: 'center',
                z: 100,
                shape: {width: 400, height: 50},
                style: {fill: 'rgba(0, 0, 0, 0.2)'}
            }, {
                type: 'text',
                left: 'center',
                top: 'center',
                z: 100,
                style: {fill: 'rgba(255, 255, 255, 0.3)', text: 'MARKOXU.COM', font: 'bold 15px sans-serif'}
            }]
        }],
        grid: {top: '10%', right:'5%', bottom: '0', left:'5%', containLabel: true},
        xAxis: {
            boundaryGap: false,
            axisLabel: {interval: xbar.length - 2},
            data: xbar
        },
        yAxis:{minInterval: 20},
        series: [{
            name: '涨停家数',
            type: 'line',
            showSymbol: false,
            color: '#d75442',
            data: stock['zdts']['ztzs']
        },{
            name: '跌停家数',
            type: 'line',
            showSymbol: false,
            color: '#59b881',
            data: stock['zdts']['dtzs']
        }]
    };
    figure2.setOption(option);
});
