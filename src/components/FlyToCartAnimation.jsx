import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useImperativeHandle, forwardRef, useRef } from "react";
import { createPortal } from "react-dom";

const FlyToCartAnimation = forwardRef((props, ref) => {
    const [animations, setAnimations] = useState([]);
    const cartIconRef = useRef(null);

    // Get current theme color from CSS variables
    const getThemeColor = useCallback(() => {
        if (typeof window === 'undefined') return "#f59e0b";
        const color = getComputedStyle(document.documentElement).getPropertyValue('--primary-600').trim();
        return color || "#f59e0b";
    }, []);

    // Get accurate cart position (fallback to bottom-right)
    const getCartPosition = useCallback(() => {
        if (cartIconRef.current) {
            const rect = cartIconRef.current.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }
        return { x: window.innerWidth - 64, y: window.innerHeight - 64 };
    }, []);

    const trigger = useCallback((startX, startY, options = {}) => {
        const id = Date.now() + Math.random();
        const cartPos = getCartPosition();
        const themeColor = getThemeColor();

        const foodEmojis = ["🍕", "🍔", "🍜", "🌮", "🍣", "🍛", "🍩", "🥐", "🥘", "🥗", "🥪", "🍳"];
        const randomEmoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];

        const animation = {
            id,
            startX,
            startY,
            endX: cartPos.x,
            endY: cartPos.y,
            color: options.color || themeColor,
            itemEmoji: options.itemEmoji || randomEmoji,
            size: options.size || 50,
            ...options
        };

        setAnimations((prev) => [...prev, animation]);
        // Cleanup after animation completes
        setTimeout(() => setAnimations((prev) => prev.filter((a) => a.id !== id)), 1000);
    }, [getCartPosition, getThemeColor]);

    useImperativeHandle(ref, () => ({ trigger }));

    return createPortal(
        <>
            {/* Hidden cart reference for positioning */}
            <div ref={cartIconRef} className="fixed bottom-6 right-6 w-12 h-12 pointer-events-none opacity-0" aria-hidden="true" />

            <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
                <AnimatePresence>
                    {animations.map((anim) => {
                        // Create a smooth parabolic arc by calculating a peak
                        const midY = Math.min(anim.startY, anim.endY) - 150;

                        return (
                            <div key={anim.id} className="absolute inset-0">
                                <motion.div
                                    initial={{
                                        x: anim.startX - anim.size / 2,
                                        y: anim.startY - anim.size / 2,
                                        scale: 0.2,
                                        opacity: 0,
                                        rotate: 0
                                    }}
                                    animate={{
                                        x: [anim.startX - anim.size / 2, anim.endX - anim.size / 2],
                                        y: [anim.startY - anim.size / 2, midY, anim.endY - anim.size / 2],
                                        scale: [0.2, 1.2, 1, 0.5],
                                        opacity: [0, 1, 1, 0],
                                        rotate: [0, 180, 360],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        ease: "easeInOut",
                                        times: [0, 0.4, 0.8, 1],
                                        // Specific bounce for scale
                                        scale: {
                                            type: "spring",
                                            damping: 12,
                                            stiffness: 200
                                        }
                                    }}
                                    className="absolute flex items-center justify-center pointer-events-none"
                                >
                                    {/* Subtle Glow Aura */}
                                    <div
                                        className="absolute inset-0 blur-xl rounded-full opacity-40"
                                        style={{ backgroundColor: anim.color }}
                                    />

                                    {/* The Food Item */}
                                    <span
                                        className="relative z-10 text-4xl sm:text-5xl filter drop-shadow-lg"
                                        style={{ color: anim.color }}
                                    >
                                        {anim.itemEmoji}
                                    </span>
                                </motion.div>
                            </div>
                        );
                    })}
                </AnimatePresence>

                {/* Simple Impact Effect at Cart */}
                <AnimatePresence>
                    {animations.length > 0 && (
                        <motion.div
                            key="cart-impact"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: [0.5, 1.5, 1], opacity: [0, 0.4, 0] }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            className="absolute pointer-events-none rounded-full"
                            style={{
                                left: getCartPosition().x - 30,
                                top: getCartPosition().y - 30,
                                width: 60,
                                height: 60,
                                backgroundColor: getThemeColor()
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>
        </>,
        document.body
    );
});

export default FlyToCartAnimation;