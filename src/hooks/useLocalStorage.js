import { ref, watch } from 'vue';
export const useLocalStorage =(key, defaultValue)=> {
    let data = ref(defaultValue);
    if (defaultValue) {
        window.localStorage.setItem(key, JSON.stringify(defaultValue));
    } else {
        data.value = JSON.parse(window.localStorage.getItem(key || {}));
    }
    watch(data, (newValue) => {
        window.localStorage.setItem(key, JSON.stringify(newValue));
    });
    return data;
}
