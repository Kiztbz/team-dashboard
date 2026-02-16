import { useEffect, useState } from "react";

export default function Loader({ onFinish }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onFinish();
        }, 1800);

        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!visible) return null;

    return (
        <div style={container}>
            <div style={content}>

                {/* Logo block */}
                <div style={logoWrapper}>
                    <div style={glow}></div>

                    {/* Replace with your logo path */}
                    <img
                        src="/logo.png.png"
                        alt="Team Dashboard"
                        style={logo}
                    />
                </div>

                {/* Title */}
                <div style={title}>
                    TEAM DASHBOARD
                </div>

                {/* Spinner */}
                <div style={spinner} />

                {/* Subtitle */}
                <div style={subtitle}>
                    Initializing workspace...
                </div>
            </div>

            {/* Animations */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @keyframes pulse {
                    0%,100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }

                @keyframes glow {
                    0% { opacity: .5; transform: scale(1); }
                    50% { opacity: .4; transform: scale(1.4); }
                    100% { opacity: .5; transform: scale(1); }
                }

                @media(max-width:768px){
                    img.loader-logo{
                        width:100px !important;
                    }
                }
            `}</style>
        </div>
    );
}

/* Styles */

const container = {
    position: "fixed",
    inset: 0,
    background: "linear-gradient(135deg,#020617,#020617,#0f172a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
};

const content = {
    textAlign: "center",
    padding: 20
};

const logoWrapper = {
    position: "relative",
    width: 300,
    height: 250,
    margin: "0 auto 20px auto"
};

const glow = {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle, rgba(74,222,128,0.4), transparent 70%)",
    borderRadius: "50%",
    animation: "glow 2s infinite ease-in-out"
};

const logo = {
    width: "300px",
    zIndex: 2,
    animation: "pulse 2s infinite ease-in-out"
};

const title = {
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: 2,
    color: "#26786f",
    marginBottom: 15
};

const spinner = {
    margin: "0 auto",
    width: 38,
    height: 38,
    border: "3px solid rgba(255,255,255,0.1)",
    borderTop: "3px solid #26786f",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
};

const subtitle = {
    marginTop: 12,
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1
};
