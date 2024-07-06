<script setup>

const selectedOption = ref(null);
const selectedPlatform = ref(null);
const newPollOptions = ref([
  { id: 1, name: "Option A", votes: 0, percentage: "0%" },
  { id: 2, name: "Option B", votes: 0, percentage: "0%" },
  { id: 3, name: "Option C", votes: 0, percentage: "0%" },
  { id: 4, name: "Option D", votes: 0, percentage: "0%" }
]);

// Function to recalculate percentages after a vote is cast
const recalculatePercentages = () => {
  const totalVotes = newPollOptions.value.reduce((total, option) => total + option.votes, 0);
  newPollOptions.value.forEach(option => {
    option.percentage = totalVotes > 0 ? `${((option.votes / totalVotes) * 100).toFixed(2)}%` : "0%";
  });
};

// Example function to increment votes for a given option
const incrementVote = (optionId) => {
  const option = newPollOptions.value.find(o => o.id === optionId);
  if (option) {
    option.votes++;
    recalculatePercentages();
  }
};
const platforms = [
    { name: "Youtube", icon: "simple-icons:youtube" },
    { name: "Rumble", icon: "simple-icons:rumble" },
    { name: "Facebook", icon: "simple-icons:facebook" },
    { name: "Twitter", icon: "simple-icons:x" },
    { name: "Twitch", icon: "simple-icons:twitch" },
];
const pollDate = ref('July 1, 2024');
const isVoteEnabled = computed(() => selectedOption.value !== null && selectedPlatform.value !== null);
</script>


<template>
    <div class="container mx-auto p-4 h-screen">
        <div class="flex my-12 items-end space-x-5">
            <Icon name="fa6-solid:square-poll-vertical" size="60" />
            <h1 class="text-7xl font-bold text-center">Poll{{ selectedOption }}</h1>
        </div>
        <div class="flex flex-col max-w-xl space-y-4">
            <div class="flex justify-between">
                <h1 class="text-lg font-bold">What color is the sky?</h1>
                <p>{{ pollDate }}</p> - {{ totalVotes }}
            </div>

            <div class="space-y-2">
  <div v-for="(option, index) in newPollOptions" :key="index">
    <button @click="selectedOption = option" :class="{ 'bg-green-500': selectedOption === option }" class="bg-black/5 hover:bg-black/10 rounded-lg flex justify-between items-center w-full">
      <div class="flex justify-between w-full px-6 py-4 relative">
        <div :style="{ width: option.percentage }" class="absolute left-0 top-0 bottom-0 bg-green-500 rounded-lg"></div>
        <h3>{{ option.name }}</h3>
        <p>{{ option.votes }} - {{ option.percentage }}</p>
      </div>
    </button>
  </div>
</div>

            <div class="flex justify-between items-center">
                <h2 class="text-lg font-bold">Viewing Platform:</h2>
                <div class="flex flex-wrap space-x-4">
                    <button v-for="(platform, index) in platforms" :key="index" @click="selectedPlatform = platform.name" :class="{ 'border-black/25 border-2': selectedPlatform === platform.name }" class="bg-black/5 hover:bg-black/10 p-4 rounded-lg flex items-center justify-center space-x-2">
                        <Icon :name="platform.icon" size="24" />
                    </button>
                </div>
            </div>

            <button  :disabled="!isVoteEnabled" class="bg-neutral-800 hover:bg-neutral-900 text-white font-bold py-4 px-4 rounded-lg disabled:bg-neutral-600 disabled:cursor-not-allowed">
  Vote
</button>
        </div>
    </div>
</template>

