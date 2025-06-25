import r6operators from "r6operators";

export const getOperatorIconFor = (title) => {
  if (!title) return null;

  const operatorIcons = {
    // Attackers
    clash: "/operators/clash.svg",
    ash: "/operators/ash.svg",
    twitch: "/operators/twitch.svg",
    thermite: "/operators/thermite.svg",
    sledge: "/operators/sledge.svg",
    thatcher: "/operators/thatcher.svg",
    hibana: "/operators/hibana.svg",
    zofia: "/operators/zofia.svg",
    dokkaebi: "/operators/dokkaebi.svg",
    ying: "/operators/ying.svg",
    jackal: "/operators/jackal.svg",
    buck: "/operators/buck.svg",
    glaz: "/operators/glaz.svg",
    capitao: "/operators/capitao.svg",
    blackbeard: "/operators/blackbeard.svg",
    nomad: "/operators/nomad.svg",
    gridlock: "/operators/gridlock.svg",
    iq: "/operators/iq.svg",
    maverick: "/operators/maverick.svg",
    ace: "/operators/ace.svg",
    zero: "/operators/zero.svg",
    osa: "/operators/osa.svg",
    grim: "/operators/grim.svg",
    sens: "/operators/sens.svg",
    amaru: "/operators/amaru.svg",
    flores: "/operators/flores.svg",
    iana: "/operators/iana.svg",
    lion: "/operators/lion.svg",
    finka: "/operators/finka.svg",
    ram: "/operators/ram.svg",
    brava: "/operators/brava.svg",
    rauora: "/operators/rauora.svg",
    striker: "/operators/striker.svg",
    deimos: "/operators/deimos.svg",
    montagne: "/operators/montagne.svg",
    blitz: "/operators/blitz.svg",
    nokk: "/operators/nokk.svg",
    kali: "/operators/kali.svg",
    fuze: "/operators/fuze.svg",

    // Defenders
    rook: "/operators/rook.svg",
    doc: "/operators/doc.svg",
    mute: "/operators/mute.svg",
    smoke: "/operators/smoke.svg",
    jager: "/operators/jager.svg",
    bandit: "/operators/bandit.svg",
    kapkan: "/operators/kapkan.svg",
    tachanka: "/operators/tachanka.svg",
    castle: "/operators/castle.svg",
    pulse: "/operators/pulse.svg",
    frost: "/operators/frost.svg",
    valkyrie: "/operators/valkyrie.svg",
    caveira: "/operators/caveira.svg",
    echo: "/operators/echo.svg",
    mira: "/operators/mira.svg",
    lesion: "/operators/lesion.svg",
    ela: "/operators/ela.svg",
    vigil: "/operators/vigil.svg",
    maestro: "/operators/maestro.svg",
    alibi: "/operators/alibi.svg",
    clash: "/operators/clash.svg",
    kaid: "/operators/kaid.svg",
    mozzie: "/operators/mozzie.svg",
    wamai: "/operators/wamai.svg",
    oryx: "/operators/oryx.svg",
    melusi: "/operators/melusi.svg",
    aruni: "/operators/aruni.svg",
    thunderbird: "/operators/thunderbird.svg",
    thorn: "/operators/thorn.svg",
    azami: "/operators/azami.svg",
    solis: "/operators/solis.svg",
    fenrir: "/operators/fenrir.svg",
    tubarao: "/operators/tubarao.svg",
    skopos: "/operators/skopos.svg",
    sentry: "/operators/sentry.svg",
    goyo: "/operators/goyo.svg",
    warden: "/operators/warden.svg",
  };

  const lowerTitle = title.toLowerCase();

  for (const operator in operatorIcons) {
    if (lowerTitle.includes(operator)) {
      return operatorIcons[operator];
    }
  }

  return null; // fallback or use: "/operators/default.svg"
};

const frag = "Use Frag Grenades on Defenders and get 1 kill";
const smoke = "Use Smoke Grenades in objective and plant the Defuser";
const stun = "Use Stun Grenades on Defenders and get 1 kill";
const hardbreach = "Use Hard Breach to open up objective and get 1 kill";
const breachingcharge =
  "Use Breaching Charges to open up objective and get a kill";
const claymore = "Setup Claymore near objective doors and get a kill";
const emp = "Use EMP Grenades to destroy Defender gadgets and get a kill";
const impact = "Use Impact Grenades to rotate and 1 kill";
const barbedwire = "Use Barbed Wire to slow down Attackers and get a kill";
const proximity = "Use Proximity Alarm to detect Attackers and get a kill";
const nitro = "Use Nitro Cell on Attackers and get a kill";
const shield = "Use Shield to block line of sight or entries get a kill";
const bulletproof =
  "Use Bulletproof camera to gain intel on Attackers and get a kill";
const observation =
  "Use Observation blocker to block important line of sight and get a kill";

export const getRandomChallenge = (selected) => {
  let attackers = [
    {
      title: "Rauora",
      type: "Attacker",
      primary: "DOM Panel Launcher",
      secondary: [smoke, breachingcharge],
      weapons: ["417", "M249", "REAPER MK2"],
    },
    {
      title: "Striker",
      secondary: [frag, breachingcharge, stun, hardbreach, smoke, emp],
      weapons: ["M4", "M249"],
    },
    {
      title: "Deimos",
      type: "Attacker",
      primary: "Deathmark Tracker",
      secondary: [frag, hardbreach],
      weapons: ["AK-74M", "M590A1", "44 VEDETTA"],
    },
    {
      title: "Ram",
      type: "Attacker",
      primary: "BU-GI Auto Breacher",
      secondary: [smoke, stun],
      weapons: ["LMG-E", "R4-C"],
    },
    {
      title: "Brava",
      type: "Attacker",
      primary: "KLUDGE DRONE",
      secondary: [smoke, claymore],
      weapons: ["PARA 308", "CAMRS"],
    },
    {
      title: "Grim",
      type: "Attacker",
      primary: "KAWAN HIVE Launcher",
      secondary: [claymore, hardbreach],
      weapons: ["552 Commando", "SG-CQB"],
    },
    {
      title: "Sens",
      type: "Attacker",
      primary: "ROU Projector System",
      secondary: [claymore, frag, hardbreach],
      weapons: ["417", "POF9"],
    },
    {
      title: "Osa",
      type: "Attacker",
      primary: "Talon 8 Clear Shield",
      secondary: [claymore, frag, emp],
      weapons: ["556XI", "PDW9"],
    },
    {
      title: "Flores",
      type: "Attacker",
      primary: "RCE Ratero Charge",
      secondary: [stun, claymore],
      weapons: ["AR33", "SR-25"],
    },
    {
      title: "Zero",
      type: "Attacker",
      primary: "ARGUS Launcher",
      secondary: [hardbreach, claymore],
      weapons: ["MP7", "SC3000K"],
    },
    {
      title: "Ace",
      type: "Attacker",
      primary: "SELMA Aqua Breacher",
      secondary: [breachingcharge, claymore],
      weapons: ["AK-12", "M1014"],
    },
    {
      title: "Iana",
      type: "Attacker",
      primary: "GEMINI Replicator",
      secondary: [emp, smoke],
      weapons: ["ARX2000", "G36C"],
    },
    {
      title: "Kali",
      type: "Attacker",
      primary: "LV Explosive Lance",
      secondary: [breachingcharge, claymore, smoke],
      weapons: ["SPSMG9", "CSRX3000", "C75 AUTO"],
    },
    {
      title: "Amaru",
      type: "Attacker",
      primary: "GARRA Hook",
      secondary: [stun, hardbreach],
      weapons: ["G8A1", "SUPERNOVA", "SMG 11"],
    },
    {
      title: "Nokk",
      type: "Attacker",
      primary: "HEL Presence Reduction",
      secondary: [hardbreach, frag, emp],
      weapons: ["FMG9", "SIX12 SD", "D50"],
    },
    {
      title: "Gridlock",
      type: "Attacker",
      primary: "TRAX Stingers",
      secondary: [smoke, frag, emp],
      weapons: ["F90", "M249 SAW"],
    },
    {
      title: "Nomad",
      type: "Attacker",
      primary: "Airjab Launcher",
      secondary: [breachingcharge, stun],
      weapons: ["AK-74M", "ARX200"],
    },
    {
      title: "Maverick",
      type: "Attacker",
      primary: "Breaching Torch",
      secondary: [claymore, smoke, stun],
      weapons: ["AR-15.50", "M4"],
    },
    {
      title: "Lion",
      type: "Attacker",
      primary: "EE-ONE-D",
      secondary: [claymore, frag, stun],
      weapons: ["417", "SG-CQB", "V308"],
    },
    {
      title: "Finka",
      type: "Attacker",
      primary: "Adrenaline Surge",
      secondary: [frag, smoke, stun],
      weapons: ["6P41", "SASG-12", "SPEAR.308"],
    },
    {
      title: "Dokkaebi",
      type: "Attacker",
      primary: "Logic Bomb",
      secondary: [smoke, stun, emp],
      weapons: ["MK 14 EBR", "BOSG 12.2", "SMG 12", "C75 AUTO"],
    },
    {
      title: "Zofia",
      type: "Attacker",
      primary: "KS79 Lifeline",
      secondary: [claymore, hardbreach],
      weapons: ["LMG-E", "M762", "RG15"],
    },
    {
      title: "Ying",
      type: "Attacker",
      primary: "Candela",
      secondary: [hardbreach, smoke],
      weapons: ["T-95 LSW", "SIX12"],
    },
    {
      title: "Jackal",
      type: "Attacker",
      primary: "EYENOX Model III",
      secondary: [claymore, smoke],
      weapons: ["C7E", "PDW9", "ITA12L"],
    },
    {
      title: "Hibana",
      type: "Attacker",
      primary: "X-KAIROS",
      secondary: [stun, breachingcharge],
      weapons: ["TYPE-89", "SUPERNOVA", "BEARING 9"],
    },
    {
      title: "Capitao",
      type: "Attacker",
      primary: "Tactical Crossbow",
      secondary: [claymore, hardbreach, emp],
      weapons: ["M249", "PARA-308"],
    },
    {
      title: "Blackbeard",
      type: "Attacker",
      primary: "HULL Adaptable Shield",
      secondary: [claymore, frag],
      weapons: ["MK17 CQB", "SR-25"],
    },
    {
      title: "Buck",
      type: "Attacker",
      primary: "Skeleton Key",
      secondary: [stun, claymore],
      weapons: ["C8-SFW", "CAMRS"],
    },
    {
      title: "Sledge",
      type: "Attacker",
      primary: "Breaching Hammer",
      secondary: [frag, stun, emp],
      weapons: ["L85A2", "M590A1"],
    },
    {
      title: "Thatcher",
      type: "Attacker",
      primary: "EMP Grenade",
      secondary: [breachingcharge, claymore],
      weapons: ["AR33", "L85A2", "M590A1"],
    },
    {
      title: "Ash",
      type: "Attacker",
      primary: "Breaching Round",
      secondary: [breachingcharge, claymore],
      weapons: ["G36C", "R4-C"],
    },
    {
      title: "Thermite",
      type: "Attacker",
      primary: "Exothermic Charge",
      secondary: [smoke, stun],
      weapons: ["M1014", "556XI"],
    },
    {
      title: "Montagne",
      type: "Attacker",
      primary: "LE ROC Shield",
      secondary: [hardbreach, smoke, emp],
      weapons: ["P9", "LFP586"],
    },
    {
      title: "Twitch",
      type: "Attacker",
      primary: "Shock Drone",
      secondary: [smoke, claymore],
      weapons: ["F2", "417", "SG-CQB"],
    },
    {
      title: "Blitz",
      type: "Attacker",
      primary: "G52-Tactical Shield",
      secondary: [smoke, breachingcharge],
      weapons: ["P12"],
    },
    {
      title: "Iq",
      type: "Attacker",
      primary: "Electronics Detector",
      secondary: [breachingcharge, frag],
      weapons: ["AUG A2", "552 COMMANDO", "G8A1"],
    },
    {
      title: "Fuze",
      type: "Attacker",
      primary: "Cluster Charge",
      secondary: [breachingcharge, hardbreach, smoke],
      weapons: ["AK-12", "6P41", "PMM", "GSH-18"],
    },
    {
      title: "Glaz",
      type: "Attacker",
      primary: "FLIP Sight",
      secondary: [smoke, frag, claymore],
      weapons: ["OTS-03"],
    },
  ];

  let defenders = [
    {
      title: "Skopos",
      type: "Defender",
      primary: "V10 Pantheon Shells",
      secondary: [impact, proximity],
      weapons: ["PCX-22"],
    },
    {
      title: "Sentry",
      secondary: [
        barbedwire,
        bulletproof,
        shield,
        observation,
        impact,
        nitro,
        proximity,
      ],
      weapons: ["COMMANDO 9", "M870", "C75 AUTO"],
    },
    {
      title: "Tubarao",
      type: "Defender",
      primary: "ZOTO Canister",
      secondary: [nitro, proximity],
      weapons: ["MPX", "AR-15.50"],
    },
    {
      title: "Fenrir",
      type: "Defender",
      primary: "F-NATT Dread Mine",
      secondary: [bulletproof, observation],
      weapons: ["MP7", "SASG-12"],
    },
    {
      title: "Solis",
      type: "Defender",
      primary: "SPEC IO ELECTRO SENSOR",
      secondary: [bulletproof, proximity],
      weapons: ["ITA12L", "P90"],
    },
    {
      title: "Azami",
      type: "Defender",
      primary: "KIBA Barrier",
      secondary: [impact, barbedwire],
      weapons: ["9X19SVN", "ACS12", "D50"],
    },
    {
      title: "Thorn",
      type: "Defender",
      primary: "Razorbloom Shell",
      secondary: [shield, barbedwire],
      weapons: ["C75 AUTO", "UZK50GI", "M870"],
    },
    {
      title: "Thunderbird",
      type: "Defender",
      primary: "KONA Station",
      secondary: [barbedwire, bulletproof, shield],
      weapons: ["SPAS-15", "SPEAR .308", "BEARING 9"],
    },
    {
      title: "Aruni",
      type: "Defender",
      primary: "Surya Gate",
      secondary: [bulletproof, barbedwire],
      weapons: ["P10 RONI", "MK14 EBR"],
    },
    {
      title: "Melusi",
      type: "Defender",
      primary: "Banshee Sonic Defence",
      secondary: [bulletproof, impact],
      weapons: ["MP5", "SUPER 90", "RG 15"],
    },
    {
      title: "Oryx",
      type: "Defender",
      primary: "REMAH DASH",
      secondary: [barbedwire, proximity],
      weapons: ["SPAS-12", "T-5 SMG"],
    },
    {
      title: "Wamai",
      type: "Defender",
      primary: "MAG-NET System",
      secondary: [proximity, impact],
      weapons: ["AUG A2", "MP5K"],
    },
    {
      title: "Goyo",
      type: "Defender",
      primary: "Volcan Canister",
      secondary: [proximity, bulletproof, impact],
      weapons: ["Vector .45 ACP", "TCSG12"],
    },
    {
      title: "Warden",
      type: "Defender",
      primary: "GLANCE Smart Glasses",
      secondary: [shield, nitro, observation],
      weapons: ["M590A1", "MPX", "P10-C", "SMG-12"],
    },
    {
      title: "Mozzie",
      type: "Defender",
      primary: "PEST Launcher",
      secondary: [barbedwire, nitro, impact],
      weapons: ["COMMANDO 9", "P10 RONI"],
    },
    {
      title: "Kaid",
      type: "Defender",
      primary: "RTILA Electroclaw",
      secondary: [barbedwire, nitro, observation],
      weapons: ["AUG A3", "TCSG12", ".44 MAG SEMIAUTO"],
    },
    {
      title: "Clash",
      type: "Defender",
      primary: "CCE Shield MK2",
      secondary: [barbedwire, impact],
      weapons: ["P10C", "SPSMG9"],
    },
    {
      title: "Maestro",
      type: "Defender",
      primary: "Evil Eye",
      secondary: [barbedwire, impact, observation],
      weapons: ["ALDA 5.56", "ACS12"],
    },
    {
      title: "Alibi",
      type: "Defender",
      primary: "PRISMA",
      secondary: [proximity, observation],
      weapons: ["MX4 STORM", "ACS12"],
    },
    {
      title: "Vigil",
      type: "Defender",
      primary: "ERC-7",
      secondary: [bulletproof, impact],
      weapons: ["K1A", "BOSG 12.2", "SMG12", "C75 AUTO"],
    },
    {
      title: "Ela",
      type: "Defender",
      primary: "GRZMOT Mine",
      secondary: [barbedwire, shield],
      weapons: ["SCORPION EVO 3 A1", "FO-12"],
    },
    {
      title: "Lesion",
      type: "Defender",
      primary: "GU Mine",
      secondary: [observation, bulletproof],
      weapons: ["SIX12 SD", "T-5 SMG"],
    },
    {
      title: "Mira",
      type: "Defender",
      primary: "Black Mirror",
      secondary: [proximity, nitro],
      weapons: ["Vector .45 ACP", "ITA12L"],
    },
    {
      title: "Echo",
      type: "Defender",
      primary: "Yokai Drone",
      secondary: [impact, shield],
      weapons: ["MP5 SD", "SUPERNOVA", "Bearing 9"],
    },
    {
      title: "Caveira",
      type: "Defender",
      primary: "Silent Step",
      secondary: [proximity, impact, observation],
      weapons: ["M12", "SPAS-15", "LUISON"],
    },
    {
      title: "Valyrie",
      type: "Defender",
      primary: "Black Eye",
      secondary: [impact, nitro],
      weapons: ["MPX", "SPAS-12"],
    },
    {
      title: "Frost",
      type: "Defender",
      primary: "Welcome Mat",
      secondary: [bulletproof, shield],
      weapons: ["SUPER 90", "9MM C1"],
    },
    {
      title: "Mute",
      type: "Defender",
      primary: "Signal Disruptor",
      secondary: [bulletproof, nitro],
      weapons: ["MP5K", "M590A1", "SMG-11"],
    },
    {
      title: "Smoke",
      type: "Defender",
      primary: "Remote Gas Grenade",
      secondary: [barbedwire, proximity],
      weapons: ["M590A1", "FMG-9", "SMG-11"],
    },
    {
      title: "Castle",
      type: "Defender",
      primary: "Armor Panel",
      secondary: [proximity, bulletproof],
      weapons: ["UMP45", "M1014"],
    },
    {
      title: "Pulse",
      type: "Defender",
      primary: "Cardiac Sensor",
      secondary: [nitro, shield, observation],
      weapons: ["UMP45", "M1014"],
    },
    {
      title: "Doc",
      type: "Defender",
      primary: "Stim Pistol",
      secondary: [bulletproof, barbedwire],
      weapons: ["MP5", "P90", "SG-CQB"],
    },
    {
      title: "Rook",
      type: "Defender",
      primary: "Armor Pack",
      secondary: [proximity, impact, observation],
      weapons: ["MP5", "P90", "SG-CQB"],
    },
    {
      title: "Jager",
      type: "Defender",
      primary: "Active Defence Systems",
      secondary: [bulletproof, observation],
      weapons: ["M870", "416-C Carbine"],
    },
    {
      title: "Bandit",
      type: "Defender",
      primary: "Shock Wire",
      secondary: [barbedwire, nitro],
      weapons: ["MP7", "M870"],
    },
    {
      title: "Tachanka",
      type: "Defender",
      primary: "SHUMIKHA Launcher",
      secondary: [barbedwire, proximity, shield],
      weapons: ["DP27", "9X19VSN"],
    },
    {
      title: "Kapkan",
      type: "Defender",
      primary: "Entry Denial Device",
      secondary: [barbedwire, bulletproof],
      weapons: ["SASG-12", "9X19VSN"],
    },
  ];

  let allAttackerChallenges = [];
  let allDefenderChallenges = [];

  attackers?.forEach((attacker) => {
    let challenges = [];
    if (attacker?.primary) {
      challenges = [
        ...challenges,
        {
          title: attacker?.title,
          description: `Use ${attacker?.primary} effectively on Defenders and get a kill`,
          type: "Attacker",
          name: "rainbow_six_siege",
        },
      ];
    }

    if (attacker?.secondary?.length > 0) {
      let gadgetRelatedChallenges = attacker?.secondary?.map((item) => {
        return {
          title: attacker?.title,
          description: item,
          type: "Attacker",
          name: "rainbow_six_siege",
        };
      });
      challenges = [...challenges, ...gadgetRelatedChallenges];
    }

    if (attacker?.weapons?.length > 0) {
      let weaponRelatedChallenges = attacker?.weapons?.map((weapon) => {
        return {
          title: attacker?.title,
          description: `Get a kill with ${weapon}`,
          type: "Attacker",
          name: "rainbow_six_siege",
        };
      });
      challenges = [...challenges, ...weaponRelatedChallenges];
    }
    allAttackerChallenges = [...allAttackerChallenges, ...challenges];
  });

  defenders?.forEach((defender) => {
    let challenges = [];
    if (defender?.primary) {
      challenges = [
        ...challenges,
        {
          title: defender?.title,
          description: `Use ${defender?.primary} effectively on Defenders and get a kill`,
          type: "Defender",
          name: "rainbow_six_siege",
        },
      ];
    }

    if (defender?.secondary?.length > 0) {
      let gadgetRelatedChallenges = defender?.secondary?.map((item) => {
        return {
          title: defender?.title,
          description: item,
          type: "Defender",
          name: "rainbow_six_siege",
        };
      });
      challenges = [...challenges, ...gadgetRelatedChallenges];
    }

    if (defender?.weapons?.length > 0) {
      let weaponRelatedChallenges = defender?.weapons?.map((weapon) => {
        return {
          title: defender?.title,
          description: `Get a kill with ${weapon}`,
          type: "Defender",
          name: "rainbow_six_siege",
        };
      });
      challenges = [...challenges, ...weaponRelatedChallenges];
    }
    allDefenderChallenges = [...allDefenderChallenges, ...challenges];
  });

  if (selected == "Attacker") {
    const shuffled = [...allAttackerChallenges].sort(() => 0.5 - Math.random());
    let challenge = shuffled.slice(0, 1)?.[0];

    return challenge;
  } else {
    const shuffled = [...allDefenderChallenges].sort(() => 0.5 - Math.random());
    let challenge = shuffled.slice(0, 1)?.[0];

    return challenge;
  }
};
