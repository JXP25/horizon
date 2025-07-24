"use client";
import React from "react";
import { motion } from "framer-motion";


const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};


const letterVariants = {
    hidden: { y: "100%" }, 
    visible: {
        y: "0%", 
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
        },
    },
};

export default function PullUpText({ text }: { text: string }) {
    return (
        <motion.span
            className="inline-block overflow-hidden align-bottom"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.7 }}
            
        >
            {text.split("").map((char, index) => (
            <motion.span
                key={index}
                className="inline-block"
                variants={letterVariants}
                style={{ display: char === " " ? "inline-block" : undefined }}
            >
                {char === " " ? "\u00A0" : char}
            </motion.span>
            ))}
        </motion.span>
    );
}
