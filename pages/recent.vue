<script setup>

const currentId = ref('');
const { data: polls, refresh } = useFetch("/api/polls");

</script>

<template>
    <div>
        {{ polls }}
    </div>
</template>

<style scoped></style>