import { ref} from 'vue';
export const useTable = (api) => {
    const data = ref([]);
    const fetchData = async () => {
        const res = await api();
        data.value = res;
    };
    fetchData(); // 立即执行以获取初始数据
    return [data];
};
                                                               