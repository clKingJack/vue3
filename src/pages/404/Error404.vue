<template>
    <div class="page-div">
        <a-row :gutter="24">
            <a-col :span="12">
                <a-card>
                    <circleEcharts id="cpu" ref="cpuRef" title="cpu使用率" />
                </a-card>
            </a-col>
            <a-col :span="12">
                <a-card>
                    <circleEcharts id="system" ref="systemRef" title="存储率" />
                </a-card>
            </a-col>
        </a-row>
        <div style="margin-top: 20px;">
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-card>
                        <treeMapEcharts />
                    </a-card>
                </a-col>
                <a-col :span="12">
                    <a-card title="存储使用率">
                        <lineEcharts id="cpuline" ref="cpulineRef" name="存储使用率" color="#fc4e4b" yAxisColor="#eea84e" />
                    </a-card>
                </a-col>
            </a-row>
        </div>
    </div>
</template>
<script setup>
import circleEcharts from './components/circleEcharts.vue'
import treeMapEcharts from './components/treeMapEcharts.vue'
import lineEcharts from './components/lineEcharts.vue'

import { ref, onMounted } from 'vue'
const initData = () => {
    return new Promise((resolve) => {
        const res = {
            code: 200,
            msg: '成功',
            result: {
                cpu: {
                    value: 50,
                },
                system: {
                    value: 80,
                }
            }
        }
        setTimeout(() => {
            resolve(res)
        }, 1000)

    })
}
const cpuLine = () => {
    return new Promise((resolve) => {
        const res = {
            code: 200,
            msg: '成功',
            result: {
                cpuLineY: [
                      [10, 12, 13, 14, 20, 50, 30, 24, 44, 53, 60, 76, 72, 80, 90, 12, 3, 12, 15],
                       ['2012-4', '2012-5', '2014-4', '2016-5', '2016-9', '2020-4', '2022-1', '2022-2', '2022-3', '2022-4', '2022-5', '2022-6', '2022-7', '2022-12'],
            ]
            }
        }
        setTimeout(() => {
            resolve(res)
        }, 1000)

    })
}
const cpuData = ref()
const systemData = ref()
const cpulineRef = ref()
const initDataList = async () => {
    const { code, result } = await initData()
    if (code === 200) {
        cpuData.value = [result.cpu.value]
        systemData.value = [result.system.value]
    }
    cpuRef.value.init(cpuData.value)
    systemRef.value.init(systemData.value)

}
const lineData = async () => {
    const { code, result } = await cpuLine();
    if (code === 200) {
        const xData = result.cpuLineY[1];
        const yData = result.cpuLineY[0];
     cpulineRef.value.initDatar(xData,yData);

    }
}
const cpuRef = ref()
const systemRef = ref()
onMounted(() => {
    initDataList()
    lineData()
})
</script>
<style>
.page-div {
    padding: 20px;

    #cpu {
        width: 100%;
        height: 300px;
    }

    #system {
        width: 100%;
        height: 300px;
    }

    #cpuline {
        width: 100%;
        height: 445px;
    }
}
</style>