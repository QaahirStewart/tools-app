<script setup>

const id = ref('2');
const { data: poll, refresh } = useFetch(`/api/poll/${id.value}`);

</script>

<template>
    <div>
        {{ poll }}
    </div>
</template>

<style scoped></style>