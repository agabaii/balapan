import React from 'react';

const Avatar = ({
    size = 120,
    skinColor = '#FFDBAC',
    hairStyle = 'short',
    hairColor = '#4B2C20',
    eyeStyle = 'normal',
    mouthStyle = 'smile',
    clothingColor = '#FF8EC4',
    accessory = 'none'
}) => {

    // Base constants for positioning
    const headY = 62;
    const headR = 38;
    const topOfHead = headY - headR; // 24

    // Layer 1: Back Hair (long hair visible behind shoulders)
    const RenderBackHair = () => {
        if (hairStyle !== 'long') return null;
        return (
            <path
                d={`M12 ${headY} Q12 15 50 15 Q88 15 88 ${headY} L92 110 Q50 120 8 110 Z`}
                fill={hairColor}
            />
        );
    };

    // Layer 2: Clothing (Shoulders)
    const RenderClothing = () => (
        <g>
            <path d="M12 105 Q50 125 88 105 L95 140 L5 140 Z" fill={clothingColor} />
            <path d="M35 108 Q50 120 65 108" fill="rgba(0,0,0,0.1)" />
        </g>
    );

    // Layer 3: Head
    const RenderFace = () => (
        <g>
            {/* Ears */}
            <circle cx="23" cy={headY} r="8" fill={skinColor} stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
            <circle cx="77" cy={headY} r="8" fill={skinColor} stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
            {/* Main Face Circle */}
            <circle cx="50" cy={headY} r={headR} fill={skinColor} stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
        </g>
    );

    // Layer 4: Front Hair Pieces (Bangs/Fringe)
    const RenderFrontHair = () => {
        const highlight = "rgba(255,255,255,0.15)";
        // We make the hair start slightly ABOVE the top of the head (topOfHead is 24, we use 18 or 20)
        switch (hairStyle) {
            case 'long':
                return (
                    <g fill={hairColor}>
                        {/* The "Cap" of the hair that covers the top of the circle */}
                        <path d={`M12 ${headY} Q12 18 50 18 Q88 18 88 ${headY} Q80 45 70 45 Q50 35 30 45 Q20 45 12 ${headY}`} />
                        <path d="M35 28 Q50 24 65 28" stroke={highlight} strokeWidth="4" fill="none" strokeLinecap="round" />
                    </g>
                );
            case 'spiky':
                return (
                    <g fill={hairColor}>
                        {/* Solid base to avoid bald spots */}
                        <path d={`M12 ${headY} Q12 20 50 20 Q88 20 88 ${headY} Z`} />
                        {/* Spikes */}
                        <path d={`M12 ${headY} L20 20 L35 45 L50 10 L65 45 L80 20 L88 ${headY} Q50 40 12 ${headY}`} />
                        <path d="M45 22 L50 17 L55 22" stroke={highlight} strokeWidth="2" fill="none" strokeLinecap="round" />
                    </g>
                );
            case 'buzz':
                return <circle cx="50" cy={headY} r={headR} fill={hairColor} fillOpacity="0.4" />;
            default: // short
                return (
                    <g fill={hairColor}>
                        <path d={`M12 ${headY} Q12 18 50 18 Q88 18 88 ${headY} Q50 42 12 ${headY}`} />
                        <path d="M35 30 Q50 25 65 30" stroke={highlight} strokeWidth="4" fill="none" strokeLinecap="round" />
                    </g>
                );
        }
    };

    const RenderEyes = () => {
        const yPos = headY;
        switch (eyeStyle) {
            case 'blink':
                return (
                    <g stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round">
                        <path d={`M38 ${yPos} Q42 ${yPos - 4} 46 ${yPos}`} />
                        <path d={`M54 ${yPos} Q58 ${yPos - 4} 62 ${yPos}`} />
                    </g>
                );
            case 'cool':
                return (
                    <g fill="#333">
                        <rect x="34" y={yPos - 4} width="14" height="7" rx="1" />
                        <rect x="52" y={yPos - 4} width="14" height="7" rx="1" />
                    </g>
                );
            default:
                return (
                    <g fill="#333">
                        <circle cx="41" cy={yPos} r="4.5" />
                        <circle cx="59" cy={yPos} r="4.5" />
                        <circle cx="39.5" cy={yPos - 1.5} r="1.5" fill="white" />
                        <circle cx="57.5" cy={yPos - 1.5} r="1.5" fill="white" />
                    </g>
                );
        }
    };

    const RenderMouth = () => (
        mouthStyle === 'surprised'
            ? <circle cx="50" cy={headY + 20} r="5" fill="#333" fillOpacity="0.1" stroke="#333" strokeWidth="1.5" />
            : mouthStyle === 'flat'
                ? <line x1="44" y1={headY + 22} x2="56" y2={headY + 22} stroke="#333" strokeWidth="3" strokeLinecap="round" />
                : <path d={`M42 ${headY + 18} Q50 ${headY + 28} 58 ${headY + 18}`} stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
    );

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 135"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
        >
            <RenderBackHair />
            <RenderClothing />
            <RenderFace />
            <RenderFrontHair />
            <RenderEyes />
            <RenderMouth />

            {accessory === 'glasses' && (
                <g stroke="#333" strokeWidth="2" fill="none">
                    <rect x="34" y={headY - 4} width="14" height="10" rx="2" />
                    <rect x="52" y={headY - 4} width="14" height="10" rx="2" />
                    <path d={`M48 ${headY + 1} L52 ${headY + 1}`} />
                </g>
            )}

            {accessory === 'crown' && (
                <g fill="#FFD700" stroke="#B8860B" strokeWidth="1">
                    <path d="M30 35 L35 20 L42 32 L50 15 L58 32 L65 20 L70 35 Z" />
                    <circle cx="35" cy="20" r="1.5" />
                    <circle cx="50" cy="15" r="1.5" />
                    <circle cx="65" cy="20" r="1.5" />
                    {/* Gem in the middle of the crown */}
                    <path d="M48 25 L50 22 L52 25 L50 28 Z" fill="#A0A0FF" stroke="none" />
                </g>
            )}
        </svg>
    );
};

export default Avatar;
