export const playSendSound = () => {
  const audio = new Audio("/sounds/send.mp3");

  audio.volume = 1.0;

  audio.play().catch((error) => {
    console.log("Audio Blocked:", error);
  });
};