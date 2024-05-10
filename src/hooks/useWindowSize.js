import { ref, onMounted, onUnmounted } from 'vue';
export const useWindwSize = () => {
    const width = ref(window.innerWidth);
    const height = ref(window.innerHeight);
    const undateWindowSize = () => {
        width.value = window.innerWidth;
        height.value = window.innerHeight;
    };

onMounted(() => {
    window.addEventListener('resize', undateWindowSize);
});
onUnmounted(() => {
    window.removeEventListener('resize', undateWindowSize);
});
 return {width,height}
};