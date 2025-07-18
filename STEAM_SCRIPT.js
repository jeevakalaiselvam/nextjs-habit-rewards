const achievements = [];

document.querySelectorAll(".steamdb_achievement").forEach((el) => {
  const title = el.querySelector("h3")?.textContent.trim() || "";
  const description = el.querySelector("h5")?.textContent.trim() || "";
  const img = el.querySelector("img")?.src || "";
  const globalPct =
    el
      .querySelector(".steamdb_achievement_unlock_global")
      ?.textContent.trim() || "";

  achievements.push({
    title,
    description,
    img,
    globalPct,
  });
});

console.log(JSON.stringify(achievements));
