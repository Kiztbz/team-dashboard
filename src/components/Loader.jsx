import { useEffect, useState } from "react";

export default function Loader({ onFinish }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onFinish();
        }, 1800);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "linear-gradient(135deg,#020617,#0f172a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999
        }}>
            <div style={{ textAlign: "center" }}>
                <div style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#4ade80",
                    letterSpacing: 2,
                    animation: "pulse 1.5s infinite"
                }}>
                    TEAM DASHBOARD
                </div>

                <div style={{
                    marginTop: 10,
                    width: 40,
                    height: 40,
                    border: "4px solid rgba(255,255,255,0.1)",
                    borderTop: "4px solid #4ade80",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }} />
            </div>

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%,100% { opacity: .6 }
          50% { opacity: 1 }
        }
      `}</style>
        </div>
    );
}
