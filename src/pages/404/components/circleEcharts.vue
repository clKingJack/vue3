<template>
    <div>
        <div :id="props.id"></div>
    </div>
</template>
<script setup>
import * as echarts from 'echarts';
import { onMounted } from 'vue';
const props = defineProps({
    id: {
        type: String,
        default: '',
    },
    title: {
        type: String,
        default: '',
    },

})
const init = (list) => {
    let chartDom = document.getElementById(props.id);
    let myChart = echarts.init(chartDom);
    let option;
    option = {
        backgroundColor: '#0a1941',
        title: {
            text: props.title,
            textStyle: {
                color: '#559BF4',
                fontSize: 20
            },
            subtext: `${list[0]}%`,
            subtextStyle: {
                color: '#B1B1B1',
                fontSize: 30
            },
            itemGap: 20,
            left: 'center',
            top: '38%'
        },
        tooltip: {
            show: false
        },
        angleAxis: {
            max: 100,
            clockwise: false, // 逆时针
            // 隐藏刻度线
            show: false
        },
        radiusAxis: {
            type: 'category',
            show: true,
            axisLabel: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        },
        polar: {
            center: ['50%', '50%'],
            radius: '150%' // 图形大小
        },
        series: [
            {
                type: 'pie',
                radius: ['55%', '95%'],
                data: [1000],
                z: -1,
                color: '#53c2f8',
                silent: true
            },
            {
                stack: '占比',
                type: 'bar',
                data: list,
                showBackground: true,
                backgroundStyle: {
                    color: '#53c2f8',
                    borderColor: '#EFF2F5',
                    borderWidth: 3
                },
                coordinateSystem: 'polar',
                roundCap: true,
                barWidth: 75,
                silent: true,
                itemStyle: {
                    normal: {
                        opacity: 1,
                        color: {
                            colorStops: [{
                                offset: 0,
                                color: '#57ccfc' // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: '#0b1b45' // 100% 处的颜色
                            }
                            ]
                        },
                        borderColor: {
                            colorStops: [{
                                offset: 0,
                                color: '#57ccfc' // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: '#0b1b45' // 100% 处的颜色
                            }
                            ]
                        },
                        borderWidth: 3
                    }
                }
            },
            {
                stack: '占比',
                type: 'bar',
                data: [0.01],
                showBackground: true,
                backgroundStyle: {
                    color: '#',
                    shadowColor: '#4fb8f3',
                    shadowBlur: 10,
                    shadowOffsetY: 2
                },
                coordinateSystem: 'polar',
                roundCap: true,
                barWidth: 30,
                itemStyle: {
                    color: '##5a59e9',
                    borderColor: '#5a59e9',
                    borderWidth: 3
                }
            }
        ]
    }
    option && myChart.setOption(option);
}
defineExpose({ init })
</script>
<style></style>