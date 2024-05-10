<template>
    <div class="check-report-list-page">
        <div class="docx"></div>
        <div class="item-outter-div">
            <div v-for="item in menuList" class="item-div">
                <div class="top">
                    <div class="img-div">
                        <img class="img" src="@/assets/images/taskMan/report-icon.png" />
                    </div>
                    <div class="name">{{ item.templateName }}</div>
                </div>
                <a-button v-if="!item.isDownload" type="text" :loading="item.loading" class="bottom-btn" @click="handleLook(item)">{{item.loading ? '正在生成中':'预览'}}</a-button>
                <a-button v-if="item.isDownload" type="text" :loading="item.downLoading" class="bottom-btn" @click="handleDownload(item)">下载</a-button>
            </div>
        </div>
        <a-modal
            style="
                top: 0px;
                max-width: 100vw;
                overflow-y: scroll;
                overflow-x: hidden;
                padding-bottom: 0;
            "
            :maskClosable="false"
            width="100vw"
            class="report-dialog"
            v-model:visible="visible"
            :title="modal.title"
            :footer="null"
        >
            <a-button class="btn-div" type="primary" @click="downLoadFile">
                <template #icon>
                    <DownloadOutlined />
                </template>
                下载
            </a-button>
            <ReportCom ref="reportComRef" />
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { exportReport, getLocalTabList, getToolsFormTask, downloadZipByLocal } from '@/api/modules/task';
import ReportCom from '../../report/index.vue';
import { DownloadOutlined } from '@ant-design/icons-vue'
import { download, getSecret } from '@/utils/util'
import { message } from 'ant-design-vue';
const router = useRouter();
const route = useRoute();
interface emitPorps {
    (e: 'prevPage'): void;
    (e: 'next'): void;
}

const emit = defineEmits<emitPorps>();

const createReport = async () => {
    const { code, data } = await exportReport({id: route.query.id as string, type: 'SITUATION_INQUIRY'})
    if(code === 200){
        console.log(data)
        menuList.value =[{
            templateName: '情况摸底',
            url: data.path
        }]
        getTemplateList();
    }
}

const handleCreateReport = async (level:string) => {
    let params:any = {
        id: route.query.id as string,
        type: 'SITUATION_INQUIRY'
    }
    if (level) {
        if (level === '低') {
            params.minSeverity = -1;
            params.maxSeverity = 3.9;
        } else if (level === '中') {
            params.minSeverity = 3.9;
            params.maxSeverity = 6.9;
        } else if (level === '高') {
            params.minSeverity = 6.9;
            params.maxSeverity = 10;
        }
    }
    const { code, data } = await exportReport(params);
    if (code === 200) {
        visible.value = true;
        modal.value.title = `情况摸底.docx`
        nextTick(() => {
            reportComRef.value.previewfile(`${getSecret(SuperBaseConfig?.superFileUrl)}/files/${data.path}`)
        })
    }
}

const getOtherReport = async () => {
    let { code, data } = await getToolsFormTask({taskId: route.query.id as string})
    if(code === 200){
        data = data.filter((v:any) => v.toolType === 'TOOL_TYPE_SENSITIVE_DATA_IDENTIFY')
        let result = []
        if(data.length){
            result = data[0].propertyList.map((v:any) => {
                return {
                    loading: false,
                    templateId: v.idStr,
                    templateName: v.taskName,
                }
            })
        }
        let list = menuList.value
        list = list.concat(result)
        menuList.value = list
        result.forEach((v:any) => {
            createToolReport(v)
        })
    }
}

const createToolReport = async (item: any) => {
    console.log(item)
    item.loading = true
    try {
        const { code, data } = await exportReport({id: item.templateId, type: 'SENSITIVE_DATA'})
        if(code === 200){
            item.url = data.path
        }
    } catch (error) {
    }
    let index = menuList.value.findIndex((v:any) => v.templateId && v.templateId === item.templateId)
    if(index !== -1){
        menuList.value[index].loading = false
    }
}

onBeforeMount(() => {
    createReport()
});

const visible = ref(false);
const modal = ref({
    title: '',
});
let templateList = ref<any>([])
const getTemplateList = async () => {
    let obj:any = localStorage.getItem('taskInfoDetail')
    if(obj){
        obj = JSON.parse(obj)
    }
    if(!route.query.id){
        return
    }
    const { code, data } = await getLocalTabList({ taskId: route.query.id as string });
    if (code === 200 && data.length) {
        templateList.value = data
        // getMenuList()
        let list = menuList.value
        list = list.concat(data.map((v:any) => {
            return {
                ...v,
                loading: false,
                addStat: false,
                templateId: templateList.value.find((o:any) => o.templateName === v.templateName).templateId
            }
        }))
        let newList = JSON.parse(JSON.stringify(list))
        list.forEach((v:any) => {
            if(v.templateName !== '情况摸底'){
                let resultIndex = newList.findIndex((o:any) => v.templateName === o.templateName)
                newList.splice(resultIndex + 1, 0, {
                    templateName:`${obj.itemName}-${obj.taskName}-${v.templateName}证明材料`,
                    isDownload: true,
                    templateId: v.templateId,
                    downLoading: false
                });
            }
        })
        menuList.value = newList
        menuList.value.forEach((v:any) => {
            createTemReport(v)
        })
        getOtherReport()
    }
};

const menuList = ref<any>([]);

const createTemReport = async (item: any) => {
    if(!item.templateId){
        return
    }
    item.loading = true
    try {
        const { code, data } = await exportReport({id: route.query.id as string, type: 'COMPOSITE', templateId: item.templateId, minSeverity: 3.9, maxSeverity: 10})
        if(code === 200){
            item.url = data.path
            item.loading = false
            console.log('list',menuList.value)
        }
    } catch (error) {
        item.loading = false
    }
}
const downLoadFile = () => {
    download(urlPath.value, urlName.value)
}
const reportComRef = ref()
const urlPath = ref('')
const urlName= ref('')
const handleLook = async(item: any) => {    
    console.log(item)
    if(!item.url){
        message.warning('报告未生成')
        return
    }
    visible.value = true;
    urlPath.value = `${getSecret(SuperBaseConfig?.superFileUrl)}/files/${item.url}`
    urlName.value = `${item.templateName}.docx`
    nextTick(() => {
        reportComRef.value.previewfile(urlPath.value)
    })
    modal.value.title = item.templateName;
};

const handleDownload = async(item:any) => {
    item.downLoading = true
    try {
        const {code,data} = await downloadZipByLocal({
            taskId: route.query.id as string,
            templateId: item.templateId,
        })
        if(code === 200){
            message.success('下载成功')
            download(
                `${getSecret(SuperBaseConfig?.superFileUrl)}/files/${data}`,
                `${item.templateName}.zip`
            );
        }
    } catch (error) {
        item.downLoading = false
    } finally{
        item.downLoading = false
    }
}
</script>

<style lang="less">
.check-report-list-page {
    .item-outter-div {
        display: flex;
        flex-wrap: wrap;
        min-height: 300px;
    }
    .btns-div {
        display: flex;
        width: 100%;
        padding-bottom: 40px;
        margin-left: 32px;
        .btn {
            width: calc(25% - 20px);
            height: 40px;
            margin-right: 24px;
        }
        .ant-btn-primary.btn:not([disabled]) {
            background-color: #085aff;
        }
        .success {
            background-color: #39b54a !important;
            border-color: #39b54a !important;
        }
    }
    .w100 {
        width: 100%;
    }
    .item-div {
        background: #ffffff;
        box-shadow: 0px 4px 4px 0px rgba(183, 183, 183, 0.302);
        border-radius: 4px 4px 4px 4px;
        opacity: 1;
        border: 1px solid #eeeeee;
        display: flex;
        flex-wrap: wrap;
        width: 280px;
        height: 320px;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 32px;
        margin-top: 40px;
        margin-bottom: 32px;
        .bottom-btn {
            width: 100%;
            height: 48px;
            background: #ffffff;
            box-shadow: 0px -2px 4px 0px rgba(198, 198, 198, 0.302);
            border-radius: 0px 0px 0px 0px;
            opacity: 1;
            font-size: 14px;
            font-family: Source Han Sans CN-Regular, Source Han Sans CN;
            font-weight: 400;
            color: #085aff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .bottom-btn:hover {
            opacity: 0.8;
        }
        .top {
            height: 270px;
        }
        .img-div {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: 60px;
            margin-bottom: 32px;
        }
        .img {
            margin: 0 auto;
            width: 68px;
            height: 84px;
        }
        .name {
            font-size: 16px;
            font-family: Source Han Sans CN-Medium, Source Han Sans CN;
            font-weight: 500;
            color: #3d3d3d;
            width: 100%;
            text-align: center;
            padding: 0 40px;
        }
    }
}
</style>
