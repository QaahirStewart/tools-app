<script setup>

const supabase = useSupabaseClient();

const currentId = 2;

const { data: voteData } = await useAsyncData("voteData", async () => {
    const { data } = await supabase
        .from("poll_votes")
        .select('*')
        .eq("poll_id", currentId);
    return data;
});

const totalVotes = computed(() => {
    return voteData.value.length;
});
</script>

<template>
    <div>
        {{ totalVotes }}
    </div>
</template>