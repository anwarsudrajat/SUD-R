document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("glassCard");

  const updateGlassGlow = (clientX, clientY) => {
    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  };

  // Interaksi sentuhan di layar HP
  card.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      updateGlassGlow(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Interaksi kursor di desktop
  card.addEventListener("mousemove", (e) => {
    updateGlassGlow(e.clientX, e.clientY);
  });
});
