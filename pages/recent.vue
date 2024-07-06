<script setup>

const supabase = useSupabaseClient();

const { data: pollData } = await useAsyncData("pollData", async () => {
    const { data } = await supabase
        .from("polls")
        .select("*")
    return data;
});
</script>

<template>
    <div>
        <ul>
            <li v-for="(value, key) in pollData" :key="key">{{ key }}: {{ value }}</li>
        </ul>
    </div>
</template>