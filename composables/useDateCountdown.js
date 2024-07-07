const useDateCountdown = (futureDate) => {
  const countdown = ref("");

  const updateCountdown = () => {
    const now = new Date();
    const difference = futureDate - now;

    if (difference <= 0) {
      countdown.value = "Time is up!";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    countdown.value = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  let intervalId;

  onMounted(() => {
    updateCountdown(); // Update immediately on mount
    intervalId = setInterval(updateCountdown, 1000); // Then update every second
  });

  onUnmounted(() => {
    clearInterval(intervalId); // Clear the interval when the component is unmounted
  });

  return { countdown };
};

export default useDateCountdown;
