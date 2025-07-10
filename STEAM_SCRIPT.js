const achievementElements = document.querySelectorAll(".steamdb_achievement");

const achievements = Array.from(achievementElements).map((el) => {
  const title = el.querySelector("h3")?.innerText?.trim() || "";
  const description =
    el.querySelector(".steamdb_achievement_spoiler")?.innerText?.trim() || "";
  const icon = el.querySelector("img")?.src || "";
  const globalUnlockRate =
    el.querySelector(".steamdb_achievement_unlock_global")?.innerText?.trim() ||
    "";

  return {
    title,
    description,
    icon,
    globalUnlockRate,
    type: "Games",
    priority: "Priority 1",
    total: 1,
    completed: 0,
    unlocked: "",
    achieved: false,
    name: "Cyberpunk 2077",
  };
});
