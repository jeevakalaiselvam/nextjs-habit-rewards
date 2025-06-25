import r6operators from "r6operators";

export const getOperatorIconFor = (title) => {
  if (!title) return null;

  const operatorIcons = {
    // Attackers
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
