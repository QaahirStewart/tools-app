<script setup>
const supabase = useSupabaseClient();

const route = useRoute();
const currentId = route.params.id;

const { data: pollData } = await useAsyncData("pollData", async () => {
  const { data } = await supabase
    .from("polls")
    .select(
      `
            *,
            poll_options (*)
        `
    )
    .eq("id", currentId);
  return data;
});

const pollName = computed(() => {
  if (pollData.value.length > 0) {
    return pollData.value[0].question;
  }
  return "Default Poll Name"; // Fallback name if pollData is empty
});

const pollDate = computed(() => {
  if (pollData.value.length > 0) {
    const date = new Date(pollData.value[0].created_at);
    // Format the date as "Month day, year"
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  return "No Date Available";
});

const options = computed(() => {
  if (pollData.value.length > 0 && pollData.value[0].poll_options.length > 0) {
    return pollData.value[0].poll_options[0].options;
  }
  return [];
});

const selectedOption = ref(null);
const selectedPlatform = ref(null);

const platforms = [
  { name: "Youtube", icon: "simple-icons:youtube" },
  { name: "Rumble", icon: "simple-icons:rumble" },
  { name: "Facebook", icon: "simple-icons:facebook" },
  { name: "Twitter", icon: "simple-icons:x" },
  { name: "Twitch", icon: "simple-icons:twitch" },
];

const isVoteEnabled = computed(
  () => selectedOption.value !== null && selectedPlatform.value !== null
);

const submitVote = async () => {
  if (isVoteEnabled.value) {
    // Submit the vote to the database

    const { error: optionsError } = await supabase.from("poll_options").insert([
            {
                poll_id: currentId.value,
                
            },
        ]);

    // Reset the selected option and platform
    selectedOption.value = null;
    selectedPlatform.value = null;
  }
};
</script>

<template>
  <div class="container mx-auto p-4 h-screen">
    <div class="flex my-12 items-end space-x-5">
      <Icon name="fa6-solid:square-poll-vertical" size="60" />
      <h1 class="text-7xl font-bold text-center">Poll - {{ selectedOption }} - {{selectedPlatform}}</h1>
    </div>
    <div class="flex flex-col max-w-xl space-y-4">
      <div class="flex justify-between">
        <h1 class="text-lg font-bold">{{ pollName }}</h1>
        <p>{{ pollDate }}</p>
      </div>

<!-- Poll Options -->

      <div class="space-y-2">
        <div v-for="(option, index) in options" :key="index">
          <button
            @click="selectedOption = option"
            class="w-full py-4 px-6 rounded-lg bg-black/5 hover:bg-black/10 text-start"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold">Viewing Platform:</h2>
        <div class="flex flex-wrap space-x-4">
          <button
            v-for="(platform, index) in platforms"
            :key="index"
            @click="selectedPlatform = platform.name"
            :class="{
              'border-black/25 border-2': selectedPlatform === platform.name,
            }"
            class="bg-black/5 hover:bg-black/10 p-4 rounded-lg flex items-center justify-center space-x-2"
          >
            <Icon :name="platform.icon" size="24" />
          </button>
        </div>
      </div>

      <button
        :disabled="!isVoteEnabled"
        @click="submitVote"
        class="bg-neutral-800 hover:bg-neutral-900 text-white font-bold py-4 px-4 rounded-lg disabled:bg-neutral-600 disabled:cursor-not-allowed"
      >
        Vote
      </button>
    </div>
  </div>
</template>
