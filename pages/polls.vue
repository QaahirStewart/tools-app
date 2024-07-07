<script setup>

const { data: polls, refresh } = useFetch("/api/polls", {
    transform: async (response) => {
        return response.polls.map((poll) => poll);
    },
});
</script>

<template>
    <div class="container max-w-2xl mx-auto p-4 h-screen">
        <div class="my-12">
            <NuxtLink to="/polls" class="flex my-4 items-end space-x-5">
                <Icon name="fa6-solid:square-poll-vertical" size="60" />
                <h1 class="text-7xl font-bold text-center">Polls</h1>
            </NuxtLink>
        </div>




        <div class="mt-4">
            <h2 class="text-3xl font-bold">Active</h2>
            <div class="mt-4">
                <div class="bg-gray-100 p-8 rounded-lg flex justify-between items-center">
                    <h3 class="text-xl font-bold">What is your favorite programming language?</h3>
                    <div>
                        <button
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Vote</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-4">
            <h2 class="text-3xl font-bold">Recent</h2>
            <div class="mt-4">
                <div class="bg-gray-100 py-8 px-3 rounded-lg flex justify-between items-center">
                    <div class="mx-4 space-y-2 w-full">
                        <div v-for="(poll, index) in polls" :key="index"
                            class="flex justify-between items-center  bg-black/5 hover:bg-black/15 py-4 pr-2 pl-6 rounded-lg">
                            <h1>{{ poll.question }}</h1>
                            <div>
                                <NuxtLink :to="`/poll/${poll.id}`"
                                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Vote
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>






    </div>
</template>

<style scoped></style>
