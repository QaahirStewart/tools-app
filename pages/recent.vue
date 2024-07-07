<script setup>
// const { data: polls } = useFetch('/api/polls');

const supabase = useSupabaseClient();

const { data: poll, refresh } = useFetch("/api/polls", {
    transform: async (response) => {
        return response.polls.find(poll => poll.id === 2);
    },
});

// Fetch vote data
const { data: rawVoteData, refresh: refreshVotes } = await useAsyncData("voteData", async () => {
    const { data } = await supabase
        .from("poll_votes")
        .select('*')
        .eq("poll_id", 2);
    return data;
});

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

    const totalVotes = Object.values(groupedVotes).reduce((sum, count) => sum + count, 0);

    return Object.entries(groupedVotes).map(([option, count]) => ({
        option_voted: option,
        count,
        percentage: totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(0) + '%' : '0%'
    }));
});

// Merge poll data and voteData
const mergedData = computed(() => {
    if (!poll.value || !voteData.value) {
        return [];
    }

    return poll.value.options.map(optionText => {
        const voteInfo = voteData.value.find(vote => vote.option_voted === optionText) || { count: 0, percentage: '0%' };
        return {
            option: optionText,
            voteCount: voteInfo.count,
            votePercentage: voteInfo.percentage
        };
    });
});
</script>

<template>
    <div>
        <p>
            {{ mergedData }}


        </p>
    </div>
</template>