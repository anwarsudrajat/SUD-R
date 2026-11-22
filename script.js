document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("glassCard");

  const updateGlassGlow = (clientX, clientY) => {
    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  };
});
