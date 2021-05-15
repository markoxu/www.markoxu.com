var figure0 = echarts.init(document.getElementById('figure0'));
figure0.showLoading();
$.getJSON('../../../assets/data/zsgz.json', function (stock) {
    figure0.hideLoading();
    function convert(stock) {
        for (var i = 0; i < stock['zsgz'].length; i++) {
            for(var j = 0; j < stock['zsgz'][i]['children'].length; j++) {
                var child = stock['zsgz'][i]['children'][j];
                var id = child['value'][9];
                if (id == 1) {child['itemStyle'] = {'color': '#414554'}; }
                else if (id == 2) {child['itemStyle'] = {'color': '#0fae9d'}; }
                else if (id == 3) {child['itemStyle'] = {'color': '#ffac12'}; }
                else {child['itemStyle'] = {'color': '#e82314'}; }
            }
        }
    }
    convert(stock);
    var itemStyle = {itemStyle: {borderColor: '#333',borderWidth: 1, gapWidth: 0.1}}
    var option = {
        title: {
            text: `更新时间：${stock['time']}`,
            left: 'center',
            textStyle: {color: '#999', fontWeight: 'normal',fontSize: 14}
        },
        tooltip: {
            formatter: function (params) {
                if (params.name.length != 0 && params.value[1] != undefined) {
                    if( typeof(params.value[7]) != 'string') {params.value[7] = params.value[7].toFixed(2);}
                    return `<div class="tooltip-title">
                            ${params.name}<br>
                            PE: ${params.value[1].toFixed(2)} (>${(params.value[2]*100).toFixed(2)}%)<br>
                            PB: ${params.value[3].toFixed(2)} (>${(params.value[4]*100).toFixed(2)}%})<br>
                            DYR: ${(params.value[5]*100).toFixed(2)}%<br>
                            ROE: ${(params.value[6]*100).toFixed(2)}%<br>
                            PEG: ${params.value[7]}<br>
                            </div>`;
                }
            }
        },
        toolbox: {
            show: true,
            itemSize: 20,
            feature: {saveAsImage: {title: "保存", pixelRatio: 2, name: "指数估值"}}
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
                style: {fill: 'rgba(0, 0, 0, 0.3)'}
            }, {
                type: 'text',
                left: 'center',
                top: 'center',
                z: 100,
                style: {fill: 'rgba(255, 255, 255, 0.3)', text: 'MARKOXU.COM', font: 'bold 15px sans-serif'}
            }]
        }],
        grid: {left:'0%', right:'5%', containLabel: true},
        series: [{
            name: '指数估值',
            type: 'treemap',
            data: stock['zsgz'],
            leafDepth: 2,
            roam: false,
            height: '100%',
            width: '100%',
            squareRatio: 1,
            label: {
                show: true,
                fontWeight: 'bold',
                formatter: function (params) {return `${params.name}`;}
            },
            levels: [itemStyle, itemStyle, itemStyle],
        }]
    };
    figure0.setOption(option);
});
