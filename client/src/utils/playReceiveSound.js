export const playReceiveSound = () => {
 
    const audio = new Audio("/sounds/receive.mp3");

    audio.volume = 1.0;

    audio.play().catch((error) => {
        console.log("Audio blocked...", error);
    })
   
}