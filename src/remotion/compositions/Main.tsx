import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

// Scene timing (30fps) - Total ~345 frames (11.5s)
const SCENE_1_START = 0; // Typing "G P" (0-30 frames = 1s)
const SCENE_2_START = 30; // Model Selection (30-60 frames = 1s)
const SCENE_3_START = 60; // Prompt Input (60-90 frames = 1s)
const SCENE_4_START = 90; // Think Deeper/Faster (90-150 frames = 2s)
const SCENE_5_START = 150; // Document Analysis (150-180 frames = 1s)
const SCENE_6_START = 180; // Streaming Text (180-270 frames = 3s)
const SCENE_7_START = 270; // CTA (270-345 frames = 2.5s)

// Colors
const GRADIENT_TOP = "#E8A698";
const GRADIENT_BOTTOM = "#9FA6E0";
const LIGHT_BLUE_TOP = "#BBE0FF";
const LIGHT_BLUE_BOTTOM = "#E0EFFF";

export const Main: React.FC = () => {
  const { fontFamily } = loadFont();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* Scene 1: Typing "G P" */}
      <Sequence from={SCENE_1_START} durationInFrames={30}>
        <Scene1Typing fps={fps} />
      </Sequence>

      {/* Scene 2: Model Selection */}
      <Sequence from={SCENE_2_START} durationInFrames={30}>
        <Scene2ModelSelection fps={fps} />
      </Sequence>

      {/* Scene 3: Prompt Input */}
      <Sequence from={SCENE_3_START} durationInFrames={30}>
        <Scene3PromptInput fps={fps} />
      </Sequence>

      {/* Scene 4: Think Deeper/Faster */}
      <Sequence from={SCENE_4_START} durationInFrames={60}>
        <Scene4ThinkDeeperFaster fps={fps} />
      </Sequence>

      {/* Scene 5: Document Analysis */}
      <Sequence from={SCENE_5_START} durationInFrames={30}>
        <Scene5DocumentAnalysis fps={fps} />
      </Sequence>

      {/* Scene 6: Streaming Text */}
      <Sequence from={SCENE_6_START} durationInFrames={90}>
        <Scene6StreamingText fps={fps} />
      </Sequence>

      {/* Scene 7: CTA */}
      <Sequence from={SCENE_7_START} durationInFrames={105}>
        <Scene7CTA fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ============ Scene Components ============

const GradientBackground: React.FC<{
  topColor?: string;
  bottomColor?: string;
}> = ({ topColor = GRADIENT_TOP, bottomColor = GRADIENT_BOTTOM }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(135deg, ${topColor} 0%, ${bottomColor} 100%)`,
    }}
  />
);

// Scene 1: Typing animation
const Scene1Typing: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  // Typing effect: "G" appears at frame 5, "P" at frame 15
  const text = frame < 5 ? "" : frame < 15 ? "G" : "G P";
  const showCursor = Math.floor(frame / 8) % 2 === 0;

  const pillScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 999,
            padding: "16px 48px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            minWidth: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${pillScale})`,
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 500, color: "#000" }}>
            {text}
            <span style={{ opacity: showCursor ? 1 : 0, marginLeft: 2 }}>
              |
            </span>
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: Model Selection Card
const Scene2ModelSelection: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  const cardScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  // Tap effect at frame 15
  const tapScale = frame >= 15 && frame < 20 ? 0.97 : 1;
  const finalScale = cardScale * tapScale;

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: "20px 28px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            minWidth: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transform: `scale(${finalScale})`,
          }}
        >
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#000" }}>
              GPT-5
            </div>
            <div style={{ fontSize: 14, color: "#666666", marginTop: 4 }}>
              Flagship model
            </div>
          </div>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12l5 5L20 7"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 3: Prompt Input with typing
const Scene3PromptInput: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const fullText = "Our smartest, fastest model yet";

  // Fast typing - reveal 2 chars per frame
  const charsToShow = Math.min(Math.floor(frame * 2), fullText.length);
  const visibleText = fullText.slice(0, charsToShow);

  const barOpacity = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // Waveform animation
  const bars = [0, 1, 2, 3].map((i) => {
    const height = 8 + Math.sin(frame * 0.5 + i * 1.5) * 6;
    return height;
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            border: "1px solid #E5E5E5",
            borderRadius: 999,
            padding: "14px 20px",
            width: "85%",
            maxWidth: 340,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: barOpacity,
          }}
        >
          {/* Plus icon */}
          <div style={{ color: "#000", fontSize: 22, fontWeight: 300 }}>+</div>

          {/* Text */}
          <div style={{ flex: 1, fontSize: 15, color: "#000" }}>
            {visibleText}
          </div>

          {/* Voice waveform */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {bars.map((height, i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  height,
                  backgroundColor: "#666",
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4: Think Deeper / Faster with toggle
const Scene4ThinkDeeperFaster: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  // Phase 1 (0-25): "Think deeper"
  // Phase 2 (25-45): Transition to "Think faster"
  // Phase 3 (45-60): Toggle animation
  const phase = frame < 25 ? 1 : frame < 45 ? 2 : 3;

  const textOpacity = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 120 },
  });

  const textY = interpolate(frame, [0, 15], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Toggle position (0 = left/deeper, 1 = right/faster)
  const toggleProgress =
    phase >= 3
      ? spring({
          frame: frame - 45,
          fps,
          config: { damping: 15, stiffness: 180 },
        })
      : 0;

  // Zoom out effect for transition to next scene
  const zoomScale = interpolate(frame, [50, 60], [1, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF" }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${zoomScale})`,
        }}
      >
        {/* Text */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            textAlign: "center",
          }}
        >
          <span style={{ color: "#000" }}>Think </span>
          {phase === 1 ? (
            <span
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              deeper
            </span>
          ) : (
            <span
              style={{
                background: "linear-gradient(135deg, #EF4444 0%, #EC4899 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              faster
            </span>
          )}
        </div>

        {/* Toggle */}
        {phase >= 3 && (
          <div
            style={{
              marginTop: 30,
              width: 60,
              height: 32,
              backgroundColor: "#E5E5E5",
              borderRadius: 999,
              position: "relative",
              opacity: spring({
                frame: frame - 45,
                fps,
                config: { damping: 20, stiffness: 100 },
              }),
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 3,
                left: 3 + toggleProgress * 28,
                width: 26,
                height: 26,
                backgroundColor: "#000",
                borderRadius: "50%",
              }}
            />
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 5: Document Analysis Cards
const Scene5DocumentAnalysis: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  const documents = [
    { icon: "📄", color: "#F472B6", name: "sales_deck.pdf" },
    { icon: "📊", color: "#4ADE80", name: "annual_report.xlsx" },
    { icon: "📝", color: "#60A5FA", name: "consult_notes.doc" },
  ];

  // Exit animation: slide up at frame 20
  const exitY = interpolate(frame, [20, 30], [0, -400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <GradientBackground
        topColor={LIGHT_BLUE_TOP}
        bottomColor={LIGHT_BLUE_BOTTOM}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `translateY(${exitY}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: "85%",
            maxWidth: 320,
          }}
        >
          {documents.map((doc, index) => {
            const staggerDelay = index * 3;
            const cardY = spring({
              frame: frame - staggerDelay,
              fps,
              config: { damping: 15, stiffness: 120 },
            });
            const cardOpacity = interpolate(
              frame - staggerDelay,
              [0, 8],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );

            return (
              <div
                key={index}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  padding: "16px 20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  opacity: cardOpacity,
                  transform: `translateY(${(1 - cardY) * 30}px)`,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: doc.color + "30",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  {doc.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                    Analyzing...
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 6: Streaming Text Generation
const Scene6StreamingText: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  const content = [
    {
      type: "body",
      text: "Below is a concise summary of the key insights from your uploaded documents:",
    },
    { type: "header", text: "Bottom line" },
    {
      type: "body",
      text: "Overall momentum remains strong across all business units, with Q4 showing 23% YoY growth.",
    },
    { type: "header", text: "Highlights" },
    { type: "bullet", text: "• Go-to-market strategy exceeded targets by 15%" },
    { type: "bullet", text: "• Customer retention rate improved to 94%" },
    { type: "bullet", text: "• New product launches drove $2.3M in revenue" },
  ];

  // Calculate total characters
  const totalChars = content.reduce((sum, item) => sum + item.text.length, 0);

  // Reveal 4 characters per frame (fast streaming)
  const charsRevealed = Math.min(frame * 4, totalChars);

  // Subtle scroll as content grows
  const scrollY = interpolate(frame, [30, 80], [0, -60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Render content with progressive reveal
  let charCount = 0;
  const renderedContent = content.map((item, index) => {
    const startChar = charCount;
    charCount += item.text.length;

    const visibleChars = Math.max(
      0,
      Math.min(charsRevealed - startChar, item.text.length),
    );
    const visibleText = item.text.slice(0, visibleChars);

    if (visibleChars === 0) return null;

    const baseStyle: React.CSSProperties = {
      marginBottom: item.type === "header" ? 8 : 12,
      marginTop: item.type === "header" && index > 0 ? 16 : 0,
    };

    if (item.type === "header") {
      return (
        <div
          key={index}
          style={{ ...baseStyle, fontSize: 18, fontWeight: 700, color: "#000" }}
        >
          {visibleText}
        </div>
      );
    }
    return (
      <div
        key={index}
        style={{ ...baseStyle, fontSize: 14, color: "#333", lineHeight: 1.6 }}
      >
        {visibleText}
      </div>
    );
  });

  const fadeIn = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  return (
    <AbsoluteFill>
      <GradientBackground
        topColor={LIGHT_BLUE_TOP}
        bottomColor={LIGHT_BLUE_BOTTOM}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: fadeIn,
          transform: `translateY(${scrollY}px)`,
        }}
      >
        <div
          style={{
            width: "85%",
            maxWidth: 340,
            textAlign: "left",
          }}
        >
          {renderedContent}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 7: CTA Button
const Scene7CTA: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  const buttonScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  // Subtle floating animation
  const floatY = Math.sin(frame * 0.08) * 4;

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 999,
            padding: "14px 28px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transform: `scale(${buttonScale}) translateY(${floatY}px)`,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 600, color: "#000" }}>
            Available now
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 17L17 7M17 7H7M17 7V17"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
