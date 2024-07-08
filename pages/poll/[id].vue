<script setup>
const supabase = useSupabaseClient();

const route = useRoute();
const currentId = parseInt(route.params.id, 10); // Convert to number

// Poll Data

const { data: poll, refresh } = useFetch("/api/polls", {
  transform: async (response) => {
    return response.polls.find((poll) => poll.id === currentId);
  },
});

// Vote Data

const { data: rawVoteData, refresh: refreshVotes } = await useAsyncData(
  "voteData",
  async () => {
    const { data } = await supabase
      .from("poll_votes", { count: "exact" })
      .select("*")
      .eq("poll_id", currentId);
    return data;
  }
);

// Transform vote data to group by option_voted, count each, and calculate percentages
const voteData = computed(() => {
  const groupedVotes = rawVoteData.value.reduce((acc, vote) => {
    if (acc[vote.option_voted]) {
      acc[vote.option_voted]++;
    } else {
      acc[vote.option_voted] = 1;
    }
    return acc;
  }, {});

  const totalVotes = Object.values(groupedVotes).reduce(
    (sum, count) => sum + count,
    0
  );

  return Object.entries(groupedVotes).map(([option, count]) => ({
    option_voted: option,
    count,
    percentage:
      totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(0) + "%" : "0%",
  }));
});

// Merge poll data and voteData
const PollData = computed(() => {
  if (!poll.value || !voteData.value) {
    return [];
  }

  return poll.value.options.map((optionText) => {
    const voteInfo = voteData.value.find(
      (vote) => vote.option_voted === optionText
    ) || { count: 0, percentage: "0%" };
    return {
      option: optionText,
      voteCount: voteInfo.count,
      votePercentage: voteInfo.percentage,
    };
  });
});

const totalVotes = computed(() => {
  if (!rawVoteData.value) return 0;
  return rawVoteData.value.reduce((sum, vote) => sum + 1, 0);
});

const randomUserID = () => {
  return Math.floor(Math.random() * 1000000);
};

const pollDate = computed(() => {
  if (poll.value && poll.value.created_at) {
    // Check if poll.value exists and has a created_at property
    const date = new Date(poll.value.created_at);
    // Format the date as "Month day, year"
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  return "No Date Available";
});

const selectedOption = ref(null);
const selectedPlatform = ref(null);

const platforms = [
  { name: "Youtube", icon: "logos:youtube-icon" },
  { name: "Rumble", icon: "simple-icons:rumble", color: "red" },
  { name: "Facebook", icon: "logos:facebook" },
  { name: "Twitter", icon: "simple-icons:x" },
  { name: "Twitch", icon: "logos:twitch" },
];

const isVoteEnabled = computed(
  () => selectedOption.value !== null && selectedPlatform.value !== null
);

const submitVote = async () => {
  if (isVoteEnabled.value) {
    // Submit the vote to the database

    const { error: optionsError } = await supabase.from("poll_votes").insert([
      {
        option_voted: selectedOption.value,
        viewing_platform: selectedPlatform.value,
        updated_at: new Date().toISOString(),
        user_id: randomUserID(),
        poll_id: currentId,
      },
    ]);

    // Reset the selected option and platform
    refreshVotes();
    selectedOption.value = null;
    selectedPlatform.value = null;
  }
};

const pollQuestion = computed(() => poll.value.question);


const highestVotedOption = computed(() => {
  if (!PollData.value || PollData.value.length === 0) {
    return "No Votes";
  }
  const result = PollData.value.reduce((highest, current) => {
    return (highest.voteCount > current.voteCount) ? highest : current;
  }, { voteCount: 0 }); // Use initial value { voteCount: 0 }

  return result.voteCount > 0 ? result.option : "-";
});

// Calculate the top viewing platform
const topViewingPlatform = computed(() => {
  const platformCounts = rawVoteData.value.reduce((acc, vote) => {
    acc[vote.viewing_platform] = (acc[vote.viewing_platform] || 0) + 1;
    return acc;
  }, {}); // Initial value is already an empty object, which is correct.
  return Object.entries(platformCounts).reduce((a, b) => (a[1] > b[1] ? a : b), ['', 0])[0]; // Added initial value ['', 0] for safety.
});
</script>

<template>
  <div class="container mx-auto overflow-auto">
    <div class="flex justify-evenly h-screen flex-col ">
      <!-- Poll Section -->

      <div class="flex flex-col max-w-xl w-full space-y-4 mx-auto">
        <NuxtLink to="/polls" class="flex my-4 items-end space-x-5">
          <Icon name="fa6-solid:square-poll-vertical" size="60" />
          <h1 class="text-7xl font-bold text-center">Poll{{ }}</h1>
        </NuxtLink>

        <div class="flex justify-between">
          <h1 class="text-lg text-md font-bold">{{ pollQuestion }}</h1>
          <p>{{ pollDate }}</p>
        </div>

        <!-- Poll Options -->

        <div class="space-y-2">
          <div v-for="(poll, index) in PollData" :key="index" class="w-full bg-black/5 hover:bg-black/10 rounded-lg">
            <button :class="{ selectedPollOption: selectedOption === poll.option }"
              @click="selectedOption = poll.option"
              class="w-full flex items-center justify-between rounded-lg relative">
              <div :style="{ width: poll.votePercentage }"
                class="flex items-center h-14 justify-between rounded-lg bg-black/10">
                <p class="pl-6">{{ poll.option }}</p>
              </div>

              <p class="absolute right-0 pr-6">{{ poll.votePercentage }}</p>
            </button>
          </div>
        </div>

        <!-- Selected Platform -->

        <div class="flex sm:flex-row flex-col justify-between items-center sm:space-y-0 space-y-4 sm:py-0 py-4">
          <h2 class="text-lg font-bold">Viewing Platform:</h2>
          <div class="flex flex-wrap space-x-4">
            <button v-for="(platform, index) in    platforms   " :key="index" @click="selectedPlatform = platform.name"
              :class="{
            selectedViewingPlatform: selectedPlatform === platform.name,
          }"
              class="bg-black/5 hover:bg-black/10  sm:size-14 size-12 rounded-lg flex items-center justify-center space-x-2">
              <Icon :name="platform.icon" size="24" :class="{ rumbleIconColor: platform.name === 'Rumble' }" />
            </button>
          </div>
        </div>

        <button :disabled="!isVoteEnabled" @click="submitVote"
          class="bg-neutral-800 hover:bg-neutral-900 text-white font-bold h-14 rounded-lg disabled:bg-neutral-600 disabled:cursor-not-allowed">
          Vote
        </button>
      </div>

      <!-- stats Section -->
      <div class="max-w-xl w-full  mx-auto flex flex-col jutify-center py-8">
        <div class=" py-8 rounded-lg bg-black/5 w-full h-full flex flex-col justify-center">
          <div class="mx-8 space-y-4 ">
            <div class="flex items-center justify-center space-x-4 pb-2 ">
              <Icon name="fa6-solid:envelope-open-text" size="30" class="" />
              <p class="font-bold">Total Votes:&nbsp;{{ totalVotes }}</p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center space-x-4 h-14 px-4 bg-black/5 rounded-lg">
                <Icon name="fa6-solid:trophy" size="24" class="text-yellow-400" />
                <div class="flex">
                  <p class="font-bold">Most Voted:&nbsp;</p>
                  <p>{{ highestVotedOption }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-4 h-14 px-4 bg-black/5 rounded-lg">
                <Icon :name="topViewingPlatform" size="24"
                  :class="{ rumbleIconColor: topViewingPlatform === 'Rumble' }" />

                <p class="font-bold">Top Viewing Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {{ rawVoteData }}

    </div>
  </div>
</template>

<style scoped>
.selectedPollOption {
  background-color: rgb(34 197 94 / 0.75);
}

.rumbleIconColor {
  color: #85C742;
}

.TwitterIconColor {
  color: black;
}

.selectedViewingPlatform {
  border-width: 3px;
  border-color: rgb(0 0 0 / 0.1);
  background: rgb(0 0 0 / 0.15);
}
</style>
