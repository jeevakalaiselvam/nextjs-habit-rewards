// Find all divs with class "box section-holder"
const sections = document.querySelectorAll("div.box.section-holder");

const trophies = [];

sections.forEach((section) => {
  // Only target actual <tr> rows inside the table
  const rows = section.querySelectorAll("table tbody tr");

  rows.forEach((row) => {
    const trophy = {};

    // Trophy image and link
    const imageAnchor = row.querySelector("td a[href*='/trophy/']");
    const image = imageAnchor?.querySelector("img.trophy");
    if (image && imageAnchor) {
      trophy.image = image.src;
      trophy.link = imageAnchor.href;
    }

    // Trophy title and description
    const titleLink = row.querySelector("a.title");
    if (titleLink) {
      trophy.name = titleLink.textContent.trim();

      // Description is a sibling text node after <br>
      const br = titleLink.nextSibling;
      if (br && br.nodeName === "BR") {
        const descNode = br.nextSibling;
        if (descNode && descNode.nodeType === Node.TEXT_NODE) {
          trophy.description = descNode.textContent.trim();
        }
      }
    }

    // Rarity percent
    const rarityPercentSpan = row.querySelector("span.typo-top");
    if (rarityPercentSpan) {
      trophy.rarityPercent = rarityPercentSpan.textContent.trim();
    }

    // Rarity label
    const rarityLabelSpan = row.querySelector("span.typo-bottom nobr");
    if (rarityLabelSpan) {
      trophy.rarityLabel = rarityLabelSpan.textContent.trim();
    }

    // Trophy type image
    const trophyTypeImg = row.querySelector("td img[alt]");
    if (trophyTypeImg) {
      trophy.typeImage = trophyTypeImg.src;
      trophy.typeLabel = trophyTypeImg.alt;
    }

    trophies.push(trophy);
  });
});

// Output the raw trophy list
console.log(trophies);

// Output the simplified structure
console.log(
  JSON.stringify(
    trophies.map((trophy) => ({
      title: trophy.name,
      description: trophy.description,
      percentage: trophy.rarityPercent?.replace("%", ""),
      color: trophy.typeLabel, // Gold/Silver/Bronze
      label: trophy.rarityLabel, // Common/Uncommon/etc.
    })),
    null,
    2
  )
);
