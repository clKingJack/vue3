lineEcharts<template>
    <div>
        <div id="main"></div>
    </div>
</template>
<script setup>
import * as echarts from 'echarts';
import { onMounted } from 'vue';
const init = () => {
    let chartDom = document.getElementById('main');
    let myChart = echarts.init(chartDom);
    let option;
    let dataname = [
        '互联网/计算机',
        '通信/电子',
        '房地产/建筑',
        '专业服务/教育',
        '制药/医疗',
        '能源',
        '政府',
        '其他1',
        '其他2',
        '其他3',
        '其他4',
    ];
    let datvalue = [1603, 1599, 1000, 950, 500, 260, 240, 130, 120, 110, 100];
    let color = ['#4B96F3', '#10C6A6', '#F2AF4B', '#FF4D4F', '#AA7AF1'];
    let colorList = [];
    for (let i = 0; i < dataname.length; i++) {
        if (i <= 4) {
            colorList[i] = color[i];
        } else {
            colorList[i] = color[i % 5];
        }
    }

    let data = [];
    for (let i = 0; i < dataname.length; i++) {
        data.push({
            value: datvalue[i],
            name: dataname[i],
            itemStyle: {
                color: colorList[i],
            },
        });
    }

    option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}',
        },
        series: [
            {
                type: 'treemap',
                width: '100%',
                height: '100%',
                breadcrumb: {
                    show: false,
                },
                label: {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontSize: 16,
                    },
                },
                itemStyle: {
                    show: true,
                    borderWidth: 1,
                    borderColor: '#fff',
                    emphasis: {
                        label: {
                            show: true,
                        },
                    },
                },
                data: data,
            },
        ],
    };
    option && myChart.setOption(option);
};
onMounted(()=>{
    init()
})
</script>

<style>
#main {
    width: 850px;
    height: 500px;
}
</style>
