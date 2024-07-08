import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);

    const id = getRouterParam(event, "id");

    const { data: pollData, pollsDataError } = await client
      .from("polls")
      .select("*")
      .eq("id", id);

    if (pollsDataError) {
      throw pollsDataError;
    }

    return {
      pollData,
    };
  } catch (error) {
    console.error("Error fetching polls:", error.message);
    return { error: error.message };
  }
});
