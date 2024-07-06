<script setup>
const supabase = useSupabaseClient();

const route = useRoute()
const currentId = route.params.id;

const { data: pollData } = await useAsyncData("pollData", async () => {
    const { data } = await supabase
        .from("polls")
        .select("*")
    return data;
});
</script>

<template>
    <div class="container mx-auto p-4 h-screen">
        <div>
            <h1 class="text-7xl font-bold text-center">Poll</h1>
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

        <div class="bg-gray-100 p-4 rounded-lg max-w-2xl mt-4 space-y-4 py-8">
            <h2 class="font-bold text-center text-2xl">History</h2>
            <div class="mx-4 space-y-2">
                <div v-for="(poll, index) in pollData" :key="index"
                    class="flex justify-between items-center  bg-black/5 hover:bg-black/15 py-4 pr-2 pl-6 rounded-lg">
                    <h1>{{ poll.question }}</h1>
                    <div>
                        <NuxtLink :to="`/poll/${poll.id}`"
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Vote</NuxtLink>
                    </div>
                </div>


            </div>
        </div>




    </div>
</template>

<style scoped></style>
