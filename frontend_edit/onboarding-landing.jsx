import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  {
    emoji: "💼",
    title: "취업 상담",
    desc: "이력서 첨삭부터 면접 준비까지, AI 커리어 코치가 도와드려요.",
    color: "#4A6FA5",
    bg: "linear-gradient(135deg, #E8EEF6 0%, #D4DEF0 100%)",
  },
  {
    emoji: "💕",
    title: "연애 상담",
    desc: "썸·연애·이별, 복잡한 마음을 함께 정리해 드려요.",
    color: "#C4697C",
    bg: "linear-gradient(135deg, #FAEAED 0%, #F2D4DA 100%)",
  },
  {
    emoji: "🔮",
    title: "사주 상담",
    desc: "사주·운세·궁합, 오늘의 운세부터 인생 흐름까지 풀어드려요.",
    color: "#7B61A6",
    bg: "linear-gradient(135deg, #EDE5F5 0%, #DDD0EE 100%)",
  },
  {
    emoji: "👶",
    title: "육아 상담",
    desc: "육아 고민, 혼자 끙끙대지 마세요. AI 육아 전문가가 함께해요.",
    color: "#5A9E6F",
    bg: "linear-gradient(135deg, #E4F2E8 0%, #CEE8D5 100%)",
  },
];

const STEPS = [
  { num: "1", title: "분야 선택", desc: "상담받고 싶은 분야를 골라요" },
  { num: "2", title: "고민 입력", desc: "카톡 보내듯 편하게 이야기해요" },
  { num: "3", title: "AI 상담", desc: "전문가 수준의 맞춤 답변을 받아요" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function OnboardingLanding() {
  const [heroRef, heroVisible] = useInView(0.1);
  const [introRef, introVisible] = useInView();
  const [cardsRef, cardsVisible] = useInView(0.08);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={styles.root}>
      {/* ─── Floating nav ─── */}
      <nav style={{
        ...styles.nav,
        background: scrollY > 60 ? "rgba(253,250,245,0.92)" : "transparent",
        backdropFilter: scrollY > 60 ? "blur(12px)" : "none",
        boxShadow: scrollY > 60 ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
      }}>
        <div style={styles.navInner}>
          <div style={styles.logoMark}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#2B3A55" />
              <path d="M9 11.5C9 10.12 10.12 9 11.5 9H16.5C17.88 9 19 10.12 19 11.5V14.5C19 15.88 17.88 17 16.5 17H15L12 20V17H11.5C10.12 17 9 15.88 9 14.5V11.5Z" fill="#F5E6C8" />
              <circle cx="12.5" cy="13" r="1" fill="#2B3A55" />
              <circle cx="15.5" cy="13" r="1" fill="#2B3A55" />
            </svg>
            <span style={styles.logoText}>TRUE</span>
          </div>
        </div>
      </nav>

      {/* ═══════ Section 1 — Hero CTA ═══════ */}
      <section ref={heroRef} style={styles.heroSection}>
        {/* Decorative blobs */}
        <div style={{ ...styles.blob, ...styles.blob1, transform: `translate(${scrollY * 0.03}px, ${scrollY * -0.02}px)` }} />
        <div style={{ ...styles.blob, ...styles.blob2, transform: `translate(${scrollY * -0.02}px, ${scrollY * 0.03}px)` }} />
        <div style={{ ...styles.blob, ...styles.blob3, transform: `translate(${scrollY * 0.015}px, ${scrollY * 0.015}px)` }} />

        <div style={{
          ...styles.heroContent,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(32px)",
        }}>
          {/* Logo icon large */}
          <div style={styles.heroLogoWrap}>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <circle cx="36" cy="36" r="36" fill="#2B3A55" />
              <path d="M22 28C22 24.69 24.69 22 28 22H44C47.31 22 50 24.69 50 28V38C50 41.31 47.31 44 44 44H39L30 52V44H28C24.69 44 22 41.31 22 38V28Z" fill="#F5E6C8" />
              <circle cx="32" cy="33" r="2.5" fill="#2B3A55" />
              <circle cx="40" cy="33" r="2.5" fill="#2B3A55" />
            </svg>
          </div>

          <h1 style={styles.heroTitle}>
            마음이 복잡할 땐,<br />
            <span style={styles.heroHighlight}>AI 전문가</span>에게 물어보세요
          </h1>
          <p style={styles.heroSub}>
            24시간, 부담 없이, 나만의 전문 상담사
          </p>

          <button
            style={styles.ctaButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(43,58,85,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(43,58,85,0.18)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: 10 }}>
              <path d="M18.17 8.83H17V4.17C17 3.07 16.1 2.17 15 2.17H5C3.9 2.17 3 3.07 3 4.17V8.83H1.83C0.73 8.83 0 9.73 0 10.83V15.83C0 16.93 0.73 17.83 1.83 17.83H18.17C19.27 17.83 20 16.93 20 15.83V10.83C20 9.73 19.27 8.83 18.17 8.83Z" fill="none" />
              <path fillRule="evenodd" clipRule="evenodd" d="M10 1C5.03 1 1 4.13 1 8C1 10.39 2.56 12.5 5 13.74V17L8.28 14.73C8.84 14.82 9.41 14.87 10 14.87C14.97 14.87 19 11.74 19 7.87C19 4.13 14.97 1 10 1Z" fill="white" />
              <path d="M6.5 7H13.5" stroke="#2B3A55" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M6.5 10H11" stroke="#2B3A55" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            지금 시작하기
          </button>

          <p style={styles.ctaNote}>Google 계정으로 3초 만에 시작</p>
        </div>

        {/* scroll indicator */}
        <div style={{
          ...styles.scrollIndicator,
          opacity: heroVisible && scrollY < 100 ? 0.6 : 0,
        }}>
          <div style={styles.scrollDot} />
        </div>
      </section>

      {/* ═══════ Section 2 — Service Intro ═══════ */}
      <section ref={introRef} style={styles.introSection}>
        <div style={{
          ...styles.introInner,
          opacity: introVisible ? 1 : 0,
          transform: introVisible ? "translateY(0)" : "translateY(40px)",
        }}>
          <span style={styles.sectionTag}>서비스 소개</span>
          <h2 style={styles.introTitle}>
            AI 전문가에게 부담 없이<br />상담받아 보세요
          </h2>
          <p style={styles.introDesc}>
            카톡처럼 편하게, 전문가처럼 깊게.<br />
            복잡한 예약도, 비싼 상담료도 필요 없어요.
          </p>

          {/* Steps */}
          <div style={styles.stepsRow}>
            {STEPS.map((s, i) => (
              <div
                key={i}
                style={{
                  ...styles.stepCard,
                  opacity: introVisible ? 1 : 0,
                  transform: introVisible ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: `${0.2 + i * 0.15}s`,
                }}
              >
                <div style={styles.stepNum}>{s.num}</div>
                <h3 style={styles.stepTitle}>{s.title}</h3>
                <p style={styles.stepDesc}>{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <div style={styles.stepArrow}>→</div>
                )}
              </div>
            ))}
          </div>

          {/* Chat preview mockup */}
          <div style={{
            ...styles.chatMockup,
            opacity: introVisible ? 1 : 0,
            transform: introVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
            transitionDelay: "0.5s",
          }}>
            <div style={styles.chatHeader}>
              <div style={styles.chatAvatar}>🤖</div>
              <div>
                <div style={styles.chatName}>AI 취업 코치</div>
                <div style={styles.chatStatus}>● 항상 온라인</div>
              </div>
            </div>
            <div style={styles.chatBody}>
              <div style={styles.chatBubbleAI}>
                안녕하세요! 😊 취업 관련 고민이 있으시군요. 어떤 부분이 가장 걱정되세요?
              </div>
              <div style={styles.chatBubbleUser}>
                이력서 자기소개서를 어떻게 써야 할지 모르겠어요...
              </div>
              <div style={styles.chatBubbleAI}>
                충분히 어려우실 수 있어요. 지원하시려는 직무와 경험을 알려주시면, 맞춤 첨삭을 도와드릴게요 ✨
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Section 3 — Categories ═══════ */}
      <section ref={cardsRef} style={styles.cardsSection}>
        <div style={styles.cardsInner}>
          <span style={{
            ...styles.sectionTag,
            opacity: cardsVisible ? 1 : 0,
            transform: cardsVisible ? "translateY(0)" : "translateY(16px)",
          }}>상담 분야</span>
          <h2 style={{
            ...styles.cardsTitle,
            opacity: cardsVisible ? 1 : 0,
            transform: cardsVisible ? "translateY(0)" : "translateY(24px)",
          }}>
            어떤 고민이든, 맞는 전문가가 있어요
          </h2>

          <div style={styles.cardsGrid}>
            {CATEGORIES.map((cat, i) => (
              <div
                key={i}
                style={{
                  ...styles.card,
                  background: cat.bg,
                  opacity: cardsVisible ? 1 : 0,
                  transform: cardsVisible ? "translateY(0)" : "translateY(30px)",
                  transitionDelay: `${0.15 + i * 0.1}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                }}
              >
                <div style={styles.cardEmoji}>{cat.emoji}</div>
                <h3 style={{ ...styles.cardTitle, color: cat.color }}>{cat.title}</h3>
                <p style={styles.cardDesc}>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerInner}>
            <div style={styles.footerLogo}>
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="14" fill="#2B3A55" opacity="0.15" />
                <path d="M9 11.5C9 10.12 10.12 9 11.5 9H16.5C17.88 9 19 10.12 19 11.5V14.5C19 15.88 17.88 17 16.5 17H15L12 20V17H11.5C10.12 17 9 15.88 9 14.5V11.5Z" fill="#2B3A55" opacity="0.3" />
              </svg>
              <span style={styles.footerBrand}>TRUE</span>
            </div>
            <p style={styles.disclaimer}>
              ⚠️ AI 조언은 참고용이며 전문가 상담을 대체하지 않습니다.
            </p>
            <p style={styles.footerCopy}>
              © 2026 TRUE. All rights reserved.
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}

/* ─────────────────── STYLES ─────────────────── */
const styles = {
  root: {
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#2B3A55",
    background: "#FDFAF5",
    minHeight: "100vh",
    overflowX: "hidden",
    WebkitFontSmoothing: "antialiased",
  },

  /* Nav */
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    transition: "all 0.35s ease",
    padding: "0 24px",
  },
  navInner: {
    maxWidth: 1080,
    margin: "0 auto",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoMark: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#2B3A55",
  },

  /* Hero */
  heroSection: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: "80px 24px 60px",
  },
  blob: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: 0.4,
    pointerEvents: "none",
    transition: "transform 0.1s linear",
  },
  blob1: {
    width: 420,
    height: 420,
    background: "radial-gradient(circle, #F5E6C8 0%, transparent 70%)",
    top: "-5%",
    right: "-8%",
  },
  blob2: {
    width: 350,
    height: 350,
    background: "radial-gradient(circle, #D4DEF0 0%, transparent 70%)",
    bottom: "5%",
    left: "-5%",
  },
  blob3: {
    width: 250,
    height: 250,
    background: "radial-gradient(circle, #F2D4DA 0%, transparent 70%)",
    top: "40%",
    right: "20%",
  },
  heroContent: {
    textAlign: "center",
    position: "relative",
    zIndex: 2,
    transition: "all 0.9s cubic-bezier(0.23, 1, 0.32, 1)",
  },
  heroLogoWrap: {
    marginBottom: 32,
    display: "inline-block",
    filter: "drop-shadow(0 8px 24px rgba(43,58,85,0.15))",
  },
  heroTitle: {
    fontSize: "clamp(28px, 5vw, 48px)",
    fontWeight: 800,
    lineHeight: 1.35,
    letterSpacing: "-0.03em",
    margin: "0 0 16px",
    color: "#2B3A55",
  },
  heroHighlight: {
    background: "linear-gradient(135deg, #4A6FA5, #7B61A6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSub: {
    fontSize: "clamp(16px, 2.5vw, 20px)",
    color: "#6B7A8D",
    margin: "0 0 40px",
    fontWeight: 400,
    lineHeight: 1.6,
  },
  ctaButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px 40px",
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    background: "linear-gradient(135deg, #2B3A55 0%, #3D5278 100%)",
    border: "none",
    borderRadius: 56,
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(43,58,85,0.18)",
    transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
    letterSpacing: "-0.01em",
    fontFamily: "inherit",
  },
  ctaNote: {
    marginTop: 16,
    fontSize: 14,
    color: "#9AA5B4",
    fontWeight: 400,
  },
  scrollIndicator: {
    position: "absolute",
    bottom: 32,
    left: "50%",
    transform: "translateX(-50%)",
    width: 28,
    height: 44,
    borderRadius: 14,
    border: "2px solid rgba(43,58,85,0.2)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: 8,
    transition: "opacity 0.4s ease",
  },
  scrollDot: {
    width: 4,
    height: 10,
    borderRadius: 2,
    background: "#2B3A55",
    opacity: 0.4,
    animation: "scrollBounce 1.8s infinite ease-in-out",
  },

  /* Intro */
  introSection: {
    padding: "100px 24px 80px",
    background: "linear-gradient(180deg, #FDFAF5 0%, #F7F3ED 100%)",
  },
  introInner: {
    maxWidth: 860,
    margin: "0 auto",
    textAlign: "center",
    transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
  },
  sectionTag: {
    display: "inline-block",
    fontSize: 13,
    fontWeight: 600,
    color: "#4A6FA5",
    background: "rgba(74,111,165,0.08)",
    padding: "6px 16px",
    borderRadius: 20,
    letterSpacing: "0.02em",
    marginBottom: 20,
    transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
  },
  introTitle: {
    fontSize: "clamp(24px, 4vw, 38px)",
    fontWeight: 800,
    lineHeight: 1.4,
    letterSpacing: "-0.03em",
    margin: "0 0 16px",
    color: "#2B3A55",
  },
  introDesc: {
    fontSize: "clamp(15px, 2vw, 18px)",
    color: "#6B7A8D",
    lineHeight: 1.7,
    margin: "0 0 48px",
  },

  /* Steps */
  stepsRow: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    marginBottom: 56,
    flexWrap: "wrap",
  },
  stepCard: {
    position: "relative",
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(8px)",
    borderRadius: 20,
    padding: "28px 24px",
    flex: "1 1 200px",
    maxWidth: 240,
    transition: "all 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
    border: "1px solid rgba(43,58,85,0.06)",
  },
  stepNum: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2B3A55, #4A6FA5)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    fontWeight: 700,
    margin: "0 auto 14px",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 700,
    margin: "0 0 6px",
    color: "#2B3A55",
  },
  stepDesc: {
    fontSize: 14,
    color: "#7D8A9A",
    margin: 0,
    lineHeight: 1.5,
  },
  stepArrow: {
    position: "absolute",
    right: -16,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 18,
    color: "#B0BAC5",
    fontWeight: 300,
  },

  /* Chat Mockup */
  chatMockup: {
    maxWidth: 400,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 4px 32px rgba(43,58,85,0.08), 0 1px 4px rgba(43,58,85,0.04)",
    border: "1px solid rgba(43,58,85,0.06)",
    transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
  },
  chatHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 20px",
    background: "linear-gradient(135deg, #2B3A55, #3D5278)",
    color: "#fff",
  },
  chatAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  chatName: {
    fontWeight: 700,
    fontSize: 15,
  },
  chatStatus: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
    color: "#8FE5A2",
  },
  chatBody: {
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  chatBubbleAI: {
    alignSelf: "flex-start",
    background: "#F3F1EC",
    padding: "12px 16px",
    borderRadius: "4px 18px 18px 18px",
    fontSize: 14,
    lineHeight: 1.6,
    maxWidth: "85%",
    color: "#2B3A55",
  },
  chatBubbleUser: {
    alignSelf: "flex-end",
    background: "linear-gradient(135deg, #4A6FA5, #5A7FB5)",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "18px 4px 18px 18px",
    fontSize: 14,
    lineHeight: 1.6,
    maxWidth: "85%",
  },

  /* Cards */
  cardsSection: {
    padding: "80px 24px 0",
    background: "#F7F3ED",
  },
  cardsInner: {
    maxWidth: 900,
    margin: "0 auto",
    textAlign: "center",
    paddingBottom: 80,
  },
  cardsTitle: {
    fontSize: "clamp(24px, 4vw, 36px)",
    fontWeight: 800,
    lineHeight: 1.4,
    letterSpacing: "-0.03em",
    margin: "0 0 40px",
    color: "#2B3A55",
    transition: "all 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
  },
  card: {
    borderRadius: 22,
    padding: "32px 24px 28px",
    textAlign: "left",
    transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
    cursor: "default",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    border: "1px solid rgba(255,255,255,0.6)",
  },
  cardEmoji: {
    fontSize: 36,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    margin: "0 0 8px",
    letterSpacing: "-0.01em",
  },
  cardDesc: {
    fontSize: 14,
    color: "#5C6B7E",
    lineHeight: 1.6,
    margin: 0,
  },

  /* Footer */
  footer: {
    borderTop: "1px solid rgba(43,58,85,0.08)",
    padding: "32px 24px",
    background: "#F3EFE8",
  },
  footerInner: {
    maxWidth: 900,
    margin: "0 auto",
    textAlign: "center",
  },
  footerLogo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  footerBrand: {
    fontSize: 14,
    fontWeight: 600,
    color: "#2B3A55",
    opacity: 0.5,
  },
  disclaimer: {
    fontSize: 13,
    color: "#8D7B6A",
    background: "rgba(141,123,106,0.08)",
    display: "inline-block",
    padding: "8px 20px",
    borderRadius: 12,
    margin: "0 0 12px",
    lineHeight: 1.5,
  },
  footerCopy: {
    fontSize: 12,
    color: "#A09080",
    margin: 0,
  },
};
