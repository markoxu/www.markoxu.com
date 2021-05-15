var figure0 = echarts.init(document.getElementById('figure0'));
figure0.showLoading();
$.getJSON('../../../assets/data/dpyt.json', function (stock) {
    figure0.hideLoading();
    function convert(root) {
        for (var i=0; i<root.children.length; i++) {
            root.children[i].value.push(root.children[i].value[1]<-10?-10:(root.children[i].value[1]>10?10:root.children[i].value[1]));
            convert(root.children[i]);
        }
    }
    convert(stock);
    var itemStyle = {
        color: [
        "#e01427", "#ce252b", "#bb2f30", "#aa3534", "#993938", "#853c3c", "#743d3f",
        "#414554",
        "#3e5f50", "#3f704f", "#3f814d", "#3c924a", "#36a446", "#2bb642", "#12c93b"].reverse(),
        colorMappingBy: 'value',
        itemStyle: {borderColor: '#333',borderWidth: 1, gapWidth: 1}
    }
    var option = {
        title: {
            text: `更新时间：${stock['time']}`,
            left: 'center',
            textStyle: {color: '#999', fontWeight: 'normal',fontSize: 14}
        },
        tooltip: {
            formatter: function (params) {
                if (params.name.length != 0 && params.value[1] != undefined) {
                    return `<div class="tooltip-title">${params.name} ${params.value[1].toFixed(2)}%</div>`;
                }
            }
        },
        toolbox: {
            show: true,
            itemSize: 20,
            feature: {saveAsImage: {title: "保存", pixelRatio: 2, name: "大盘云图"}}
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
                style: {fill: 'rgba(0, 0, 0, 0.1)'}
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
            name: '大盘云图',
            type: 'treemap',
            data: stock.children,
            roam: false,
            leafDepth: 1,
            drillDownIcon: '',
            height: '100%',
            width: '100%',
            visualDimension: 2,
            visualMin: -10,
            visualMax: 10,
            label: {
                show: true,
                fontWeight: "bold",
                formatter: function (params) {return `${params.name}\n${params.value[1].toFixed(2)}%`;}
            },
            levels: [itemStyle, itemStyle, itemStyle, itemStyle, itemStyle],
        }]
    };
    figure0.setOption(option);
});
