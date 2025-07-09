// Find all divs with class "box section-holder"
const sections = document.querySelectorAll("div.box.section-holder");

const trophies = [];

sections.forEach((section) => {
  const trophy = {};

  // Trophy link and image
  const linkWithImage = section.querySelector("td a img");
  if (linkWithImage) {
    trophy.image = linkWithImage.src;
    trophy.link = linkWithImage.closest("a").href;
  }

  // Trophy title and description
  const titleLink = section.querySelector("a.title");
  if (titleLink) {
    trophy.name = titleLink.textContent.trim();

    // The description is the next text node after the <br>
    const br = titleLink.nextSibling;
    if (br && br.nodeName === "BR") {
      const descNode = br.nextSibling;
      if (descNode && descNode.nodeType === Node.TEXT_NODE) {
        trophy.description = descNode.textContent.trim();
      }
    }
  }

  // Rarity percent
  const rarityPercentSpan = section.querySelector("span.typo-top");
  if (rarityPercentSpan) {
    trophy.rarityPercent = rarityPercentSpan.textContent.trim();
  }

  // Rarity label
  const rarityLabelSpan = section.querySelector("span.typo-bottom nobr");
  if (rarityLabelSpan) {
    trophy.rarityLabel = rarityLabelSpan.textContent.trim();
  }

  // Trophy type image
  const trophyTypeImg = section.querySelector("td center img");
  if (trophyTypeImg) {
    trophy.typeImage = trophyTypeImg.src;
    trophy.typeLabel = trophyTypeImg.alt;
  }

  trophies.push(trophy);
});
console.log(
  JSON.stringify(
    trophies?.map((trophy) => {
      return {
        title: trophy?.name,
        description: trophy?.description,
        icon: trophy?.image,
        type: "Games",
        priority: "Priority 1",
        total: 1,
        completed: 0,
        unlocked: "",
        achieved: false,
        name: "Black Myth Wukong",
        percentage: trophy?.rarityPercent?.split("%")?.[0],
        color: trophy?.typeLabel,
      };
    })
  )
);
