<template>
    <div>
        <div :id="props.id"></div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref } from 'vue';
const props = defineProps({
    id: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: '',
    },
    color:{
        type: String,
        default: '',
    },
    yAxisColor:{
        type: String,
        default: '#eea84e',
    }
})
const cpulineRef = ref(null);
const initDatar = (xData, yData) => {
    let chartDom = document.getElementById(props.id);
    let myChart = echarts.init(chartDom);
    let option = {
        backgroundColor: "#0f195a",
        xAxis: {
            type: 'category',
            data: xData,
            splitLine: {
                show: false, // 隐藏x轴网格线
            },
            axisLabel: {
                color: props.color // x轴文字颜色
            },
        },
        lineStyle: {
            color: "rgba(231, 197, 101)", // 线的颜色
            width: 15, // 线宽
            type: "solid", // 线型
        },
        // tooltip: {
        //     axisPointer: {
        //         animation: false
        //     }
        // },
        tooltip: {
            trigger: 'axis',
            textStyle: {
                fontSize: 18 // 字体大小
            },
            axisPointer: {
                type: 'shadow'
            },
            formatter(param) {
                return props.name + ':' + param[0].value + '%'; // 鼠标移入显示的字体
            },
        },
        yAxis: {
            type: 'value',

            splitLine: {
                show: false // 隐藏y轴网格线
            },
            axisLabel: {
                formatter: '{value} %',
                color: props.yAxisColor,  // y轴文字颜色
            },
        },
        grid: {
        top: '14%',
        left: '4%',
        right: '4%',
        bottom: '20%',
        containLabel: true
    },
        series: [
            {
                data: yData,
                type: 'line',
                smooth: true,
                showSymbol: false, // 隐藏点
                lineStyle: {
                    type: 'dashed', // 设置线条样式
                    color: '#eea84e',
                },
            }
        ]
    };
    option && myChart.setOption(option);
}
defineExpose({ initDatar })


</script>
