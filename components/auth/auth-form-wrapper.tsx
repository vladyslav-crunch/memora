"use client";

import {ReactNode} from "react";
import {motion} from "framer-motion";

type AuthMotionWrapperProps = {
    title: string;
    children: ReactNode;
    animateFrom?: { x?: number; y?: number; opacity?: number };
};

export default function AuthFormWrapper({
                                            title,
                                            children,
                                            animateFrom = {opacity: 0, x: -50},
                                        }: AuthMotionWrapperProps) {
    return (
        <div className="w-full flex justify-center lg:justify-start">
            <motion.div
                className="w-full max-w-md"
                initial={animateFrom}
                animate={{opacity: 1, x: 0, y: 0}}
                transition={{duration: 0.6, ease: "easeOut"}}
            >
                <h1 className="text-[28px] font-semibold mb-4 text-center lg:text-left">
                    {title}
                </h1>
                {children}
            </motion.div>
        </div>
    );
}
