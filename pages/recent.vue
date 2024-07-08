<script setup>

const pollId = ref('2');
const fetchUrl = computed(() => `/api/poll/${pollId.value}`);

const { data: poll, refresh } = useFetch(fetchUrl, {
    transform: async (response) => {
        // If response.poll is an array and you want the first item
        return response.poll[0];
    },
});



// Check if poll.value is not null before accessing end_at
const futureDate = computed(() => {
    if (poll.value) {
        return new Date(poll.value.end_at);
    }
    return new Date(); // Return current date or some default value if poll.value is null
});

const { countdown } = useDateCountdown(futureDate.value);



</script>

<template>
    <div>
        {{ countdown }}
    </div>
</template>

<style scoped></style>