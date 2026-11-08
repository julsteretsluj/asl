const ink = "#1D1D1F";
const paper = "#F7F6F2";

function Capsule({ x, y, w, h }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={Math.min(w, h) / 2}
      fill={paper}
      stroke={ink}
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
  );
}

function Palm() {
  return <Capsule x={52} y={108} w={86} h={78} />;
}

function Fingers({ specs }) {
  return specs.map((finger) => <Capsule key={`${finger.x}-${finger.y}`} {...finger} />);
}

function Motion({ kind, playKey, speed, quiet }) {
  if (!kind) return null;
  const d = kind === "j" ? "M146 36c24 4 32 28 18 44-14 16-32 10-28-4" : "M138 28h40L138 64h40";
  return (
    <path
      key={playKey}
      d={d}
      pathLength="100"
      fill="none"
      stroke="#007AFF"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={quiet ? undefined : "sign-draw"}
      style={{
        "--play-speed": speed,
        strokeDasharray: 100,
        strokeDashoffset: quiet ? 0 : undefined,
      }}
    />
  );
}

function Shape({ letter }) {
  switch (letter) {
    case "A":
      return (
        <>
          <Palm />
          <Capsule x={28} y={132} w={36} h={22} />
        </>
      );
    case "B":
      return (
        <>
          <Fingers
            specs={[
              { x: 58, y: 22, w: 18, h: 100 },
              { x: 74, y: 18, w: 18, h: 104 },
              { x: 90, y: 18, w: 18, h: 104 },
              { x: 106, y: 22, w: 18, h: 100 },
            ]}
          />
          <Palm />
          <Capsule x={64} y={126} w={62} h={18} />
        </>
      );
    case "C":
      return (
        <path
          d="M132 46c-46 2-68 32-66 66 2 36 28 60 70 58"
          fill="none"
          stroke={ink}
          strokeWidth="22"
          strokeLinecap="round"
        />
      );
    case "D":
      return (
        <>
          <Capsule x={78} y={16} w={20} h={108} />
          <Palm />
          <ellipse cx="86" cy="138" rx="18" ry="14" fill={paper} stroke={ink} strokeWidth="2.4" />
        </>
      );
    case "E":
      return (
        <>
          <Palm />
          <Capsule x={62} y={118} w={66} h={18} />
          <Fingers
            specs={[
              { x: 64, y: 96, w: 14, h: 28 },
              { x: 80, y: 92, w: 14, h: 30 },
              { x: 96, y: 92, w: 14, h: 30 },
              { x: 112, y: 98, w: 14, h: 26 },
            ]}
          />
        </>
      );
    case "F":
      return (
        <>
          <Fingers
            specs={[
              { x: 86, y: 20, w: 16, h: 102 },
              { x: 102, y: 16, w: 16, h: 106 },
              { x: 118, y: 22, w: 16, h: 100 },
            ]}
          />
          <Palm />
          <ellipse cx="62" cy="86" rx="16" ry="13" fill={paper} stroke={ink} strokeWidth="2.4" />
        </>
      );
    case "G":
      return (
        <>
          <Capsule x={86} y={92} w={58} h={58} />
          <Capsule x={18} y={96} w={92} h={18} />
          <Capsule x={26} y={120} w={78} h={16} />
        </>
      );
    case "H":
      return (
        <>
          <Capsule x={96} y={100} w={52} h={52} />
          <Capsule x={16} y={96} w={104} h={16} />
          <Capsule x={16} y={116} w={104} h={16} />
        </>
      );
    case "I":
    case "J":
      return (
        <>
          <Capsule x={112} y={28} w={18} h={96} />
          <Palm />
          <Capsule x={64} y={128} w={58} h={18} />
        </>
      );
    case "K":
      return (
        <>
          <Capsule x={62} y={18} w={18} h={108} />
          <Capsule x={98} y={18} w={18} h={108} />
          <Palm />
          <Capsule x={46} y={118} w={48} h={16} />
        </>
      );
    case "L":
      return (
        <>
          <Capsule x={70} y={16} w={20} h={112} />
          <Palm />
          <Capsule x={16} y={150} w={58} h={18} />
        </>
      );
    case "M":
      return (
        <>
          <Palm />
          <Capsule x={40} y={146} w={18} h={28} />
          <Fingers
            specs={[
              { x: 62, y: 92, w: 18, h: 32 },
              { x: 82, y: 88, w: 18, h: 34 },
              { x: 102, y: 92, w: 18, h: 32 },
            ]}
          />
        </>
      );
    case "N":
      return (
        <>
          <Palm />
          <Capsule x={70} y={148} w={16} h={26} />
          <Fingers
            specs={[
              { x: 66, y: 90, w: 18, h: 34 },
              { x: 88, y: 90, w: 18, h: 34 },
            ]}
          />
        </>
      );
    case "O":
      return (
        <ellipse cx="95" cy="112" rx="38" ry="48" fill="none" stroke={ink} strokeWidth="18" />
      );
    case "P":
      return (
        <>
          <Capsule x={64} y={118} w={18} h={78} />
          <Capsule x={96} y={118} w={18} h={78} />
          <Capsule x={52} y={48} w={86} h={78} />
          <Capsule x={78} y={108} w={40} h={16} />
        </>
      );
    case "Q":
      return (
        <>
          <Capsule x={78} y={28} w={52} h={52} />
          <Capsule x={90} y={72} w={16} h={86} />
          <Capsule x={112} y={84} w={16} h={70} />
        </>
      );
    case "R":
      return (
        <>
          <Capsule x={70} y={20} w={18} h={104} />
          <g transform="rotate(16 102 70)">
            <Capsule x={90} y={20} w={18} h={104} />
          </g>
          <Palm />
          <Capsule x={62} y={130} w={56} h={16} />
        </>
      );
    case "S":
      return (
        <>
          <Palm />
          <Capsule x={60} y={132} w={70} h={20} />
        </>
      );
    case "T":
      return (
        <>
          <Palm />
          <Capsule x={78} y={86} w={18} h={36} />
        </>
      );
    case "U":
      return (
        <>
          <Fingers
            specs={[
              { x: 74, y: 18, w: 18, h: 106 },
              { x: 90, y: 18, w: 18, h: 106 },
            ]}
          />
          <Palm />
          <Capsule x={64} y={128} w={58} h={18} />
        </>
      );
    case "V":
      return (
        <>
          <Fingers
            specs={[
              { x: 58, y: 18, w: 18, h: 108 },
              { x: 104, y: 18, w: 18, h: 108 },
            ]}
          />
          <Palm />
          <Capsule x={66} y={130} w={56} h={18} />
        </>
      );
    case "W":
      return (
        <>
          <Fingers
            specs={[
              { x: 52, y: 22, w: 16, h: 102 },
              { x: 74, y: 16, w: 16, h: 108 },
              { x: 96, y: 22, w: 16, h: 102 },
            ]}
          />
          <Palm />
          <Capsule x={108} y={132} w={28} h={16} />
        </>
      );
    case "X":
      return (
        <>
          <path
            d="M86 118 V78 c0-18 22-24 24-4 c1 12-8 18-10 32 v16"
            fill={paper}
            stroke={ink}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <Palm />
          <Capsule x={34} y={136} w={32} h={20} />
        </>
      );
    case "Y":
      return (
        <>
          <Capsule x={114} y={36} w={18} h={90} />
          <Palm />
          <Capsule x={18} y={148} w={50} h={18} />
        </>
      );
    case "Z":
      return (
        <>
          <Capsule x={78} y={22} w={18} h={102} />
          <Palm />
          <Capsule x={64} y={130} w={52} h={18} />
        </>
      );
    default:
      return null;
  }
}

const HAND_ART = {
  A: "/hands/a.png",
  "Open A": "/hands/open-a.png",
  B: "/hands/b.png",
  "Open B": "/hands/open-b.png",
  "Bent B": "/hands/bent-b.png",
  C: "/hands/c.png",
  D: "/hands/d.png",
  E: "/hands/e.png",
  F: "/hands/f.png",
  G: "/hands/g.png",
  H: "/hands/h.png",
  I: "/hands/i.png",
  J: "/hands/j.png",
  K: "/hands/k.png",
  L: "/hands/l.png",
  M: "/hands/m.png",
  N: "/hands/n.png",
  O: "/hands/o.png",
  "Flat O": "/hands/flat-o.png",
  P: "/hands/p.png",
  Q: "/hands/q.png",
  R: "/hands/r.png",
  S: "/hands/s.png",
  T: "/hands/t.png",
  U: "/hands/u.png",
  V: "/hands/v.png",
  "Bent V": "/hands/bent-v.png",
  W: "/hands/w.png",
  X: "/hands/x.png",
  Y: "/hands/y.png",
  Z: "/hands/z.png",
  "I love you": "/hands/ily.png",
  1: "/hands/1.png",
  3: "/hands/3.png",
  "Bent 3": "/hands/bent-3.png",
  4: "/hands/4.png",
  5: "/hands/5.png",
  "Bent 5": "/hands/bent-5.png",
  8: "/hands/8.png",
  "Open 8": "/hands/open-8.png",
};

function HandArt({ src }) {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
      <img
        src={src}
        alt=""
        draggable="false"
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}

export function HandDiagram({ letter, playKey = 0, speed = 1, quiet = false }) {
  const art = HAND_ART[letter];
  if (art) return <HandArt src={art} />;
  const motion = letter === "J" ? "j" : letter === "Z" ? "z" : null;
  return (
    <svg viewBox="0 0 180 210" className="h-full w-full" aria-hidden="true">
      <Shape letter={letter} />
      <Motion kind={motion} playKey={playKey} speed={speed} quiet={quiet} />
    </svg>
  );
}
