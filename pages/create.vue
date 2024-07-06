<script setup>

const supabase = useSupabaseClient();

const question = ref("");

// Initialize options with a default number of options, e.g., 2 options
const options = ref(["", ""]);

function addOption() {
    if (options.value.length < 6) {
        options.value.push("");
    } else {
        console.log("Maximum of 6 options reached");
    }
}

const createPollAndOptions = async () => {
    let pollId = null; // Initialize pollId variable
    try {
        // Create the poll and get its ID
        const { data: pollData, error: pollError } = await supabase
            .from("polls")
            .insert([{ question: question.value }])
            .select("id");

        if (pollError) throw pollError;

        pollId = pollData[0].id; // Assign the id to pollId variable
        console.log(pollId); // Use pollId variable

        // Create poll options using the retrieved pollId
        const { error: optionsError } = await supabase.from("poll_options").insert([
            {
                poll_id: pollId, // Use the pollId from the created poll
                options: options.value,
            },
        ]);

        if (optionsError) throw optionsError;

    } catch (error) {
        console.log(error);
        return null; // Return null in case of an error.
    }
    return pollId; // Return pollId at the end of the function
};
</script>

<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Create a Poll</h1>
        <div class="mb-4">
            <label for="question" class="block mb-2">Question:</label>
            <input v-model="question" type="text" id="question" class="border p-2 w-full"
                placeholder="Enter your question" />
        </div>
        <div v-for="(option, index) in options" :key="index" class="mb-4 flex items-center space-x-3">
            <label class="block flex-none">Option {{ index + 1 }}:</label>
            <input v-model="options[index]" type="text" class="border p-2 w-full" placeholder="Enter an option" />
        </div>
        <button @click="addOption" class="bg-blue-500 text-white p-2 rounded">Add Option</button>
        <div class="mt-4">
            <button @click="createPollAndOptions" class="bg-green-500 text-white p-2 rounded">Create
                Poll</button>
        </div>
    </div>

</template>

<style scoped></style>