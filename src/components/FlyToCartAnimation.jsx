import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useImperativeHandle, forwardRef, useRef } from "react";
import { createPortal } from "react-dom";

const FlyToCartAnimation = forwardRef((props, ref) => {
    const [animations, setAnimations] = useState([]);
    const [impacts, setImpacts] = useState([]);
    const cartIconRef = useRef(null);

    // Get current theme color from CSS variables
    const getThemeColor = useCallback(() => {
        if (typeof window === 'undefined') return "#f59e0b";
        const color = getComputedStyle(document.documentElement).getPropertyValue('--primary-600').trim();
        return color || "#f59e0b";
    }, []);

    // Get accurate cart position
    const getCartPosition = useCallback(() => {
        // Look for the element we tagged in PublicRestaurantView
        const realCart = document.querySelector('[data-cart-button]');
        if (realCart) {
            const rect = realCart.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }

        // Internal fallback ref
        if (cartIconRef.current) {
            const rect = cartIconRef.current.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }

        // Screen edge fallback
        return { x: window.innerWidth - 40, y: window.innerHeight - 40 };
    }, []);

    const trigger = useCallback((startX, startY, options = {}) => {
        const id = Date.now() + Math.random();
        const cartPos = getCartPosition();
        const themeColor = getThemeColor();

        const foodEmojis = ["🍕", "🍔", "🍜", "🌮", "🍣", "🍛", "🍩", "🥐", "🥘", "🥗", "🥪", "🍳"];
        const randomEmoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];

        // Force a fresh calculation of current viewport coordinates
        const animation = {
            id,
            startX,
            startY,
            endX: cartPos.x,
            endY: cartPos.y,
            color: options.color || themeColor,
            itemEmoji: options.itemEmoji || randomEmoji,
            size: options.size || (window.innerWidth < 640 ? 32 : 44),
            ...options
        };

        setAnimations((prev) => [...prev, animation]);
    }, [getCartPosition, getThemeColor]);

    const handleComplete = useCallback((anim) => {
        setAnimations((prev) => prev.filter((a) => a.id !== anim.id));

        // Impact effect
        const impactId = Date.now() + Math.random();
        setImpacts(prev => [...prev, { id: impactId, x: anim.endX, y: anim.endY, color: anim.color }]);
        setTimeout(() => setImpacts(prev => prev.filter(i => i.id !== impactId)), 600);
    }, []);

    useImperativeHandle(ref, () => ({ trigger }));

    return createPortal(
        <>
            {/* Minimal hidden fallback */}
            <div ref={cartIconRef} className="fixed bottom-6 right-6 w-1 h-1 pointer-events-none opacity-0" />

            <div className="fixed inset-0 pointer-events-none z-[99999]">
                <AnimatePresence>
                    {animations.map((anim) => {
                        // High parabolic arc calculation
                        const arcHeight = window.innerWidth < 640 ? 120 : 250;
                        const midY = Math.min(anim.startY, anim.endY) - arcHeight;

                        return (
                            <motion.div
                                key={anim.id}
                                className="absolute top-0 left-0 flex items-center justify-center"
                                onAnimationComplete={() => handleComplete(anim)}
                                initial={{ x: anim.startX, y: anim.startY, scale: 0, opacity: 0 }}
                                animate={{
                                    x: [anim.startX, (anim.startX + anim.endX) / 2, anim.endX],
                                    y: [anim.startY, midY, anim.endY],
                                    scale: [0, 1.4, 1.2, 0.4],
                                    opacity: [1, 1, 1, 0.5],
                                    rotate: [0, 90, 360, 720]
                                }}
                                transition={{
                                    duration: 0.9,
                                    ease: "easeInOut",
                                    times: [0, 0.4, 0.7, 1]
                                }}
                                style={{
                                    width: anim.size,
                                    height: anim.size,
                                    marginLeft: -anim.size / 2,
                                    marginTop: -anim.size / 2
                                }}
                            >
                                {/* Glow */}
                                <div
                                    className="absolute inset-0 blur-xl rounded-full opacity-30"
                                    style={{ backgroundColor: anim.color }}
                                />

                                {/* Item */}
                                <span
                                    className="relative z-10 select-none filter drop-shadow-md"
                                    style={{ fontSize: anim.size }}
                                >
                                    {anim.itemEmoji}
                                </span>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Enhanced Impact Effects */}
                <AnimatePresence>
                    {impacts.map((impact) => (
                        <div key={impact.id} className="absolute inset-0 pointer-events-none">
                            {/* Primary Sonic Ripple */}
                            <motion.div
                                initial={{ scale: 0.5, opacity: 1 }}
                                animate={{ scale: 4, opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 rounded-full"
                                style={{ left: impact.x, top: impact.y, borderColor: impact.color }}
                            />

                            {/* Secondary Staggered Ripple */}
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0.8 }}
                                animate={{ scale: 3, opacity: 0 }}
                                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                                className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 border rounded-full"
                                style={{ left: impact.x, top: impact.y, borderColor: impact.color }}
                            />

                            {/* Core Flash */}
                            <motion.div
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full blur-md"
                                style={{ left: impact.x, top: impact.y, backgroundColor: impact.color }}
                            />

                            {/* Particle Burst */}
                            {[...Array(8)].map((_, i) => {
                                const angle = (i * 45) * (Math.PI / 180);
                                const distance = 40 + Math.random() * 40;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ x: impact.x, y: impact.y, scale: 1, opacity: 1 }}
                                        animate={{
                                            x: impact.x + Math.cos(angle) * distance,
                                            y: impact.y + Math.sin(angle) * distance,
                                            scale: 0,
                                            opacity: 0
                                        }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="absolute w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: impact.color }}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </>,
        document.body
    );
});

export default FlyToCartAnimation;