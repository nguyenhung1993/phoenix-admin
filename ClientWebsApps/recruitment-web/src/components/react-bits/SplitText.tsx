'use client';

import { useSpring, animated } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
    text?: string;
    className?: string;
    delay?: number;
}

export const SplitText = ({ text = '', className = '', delay = 100 }: SplitTextProps) => {
    const words = text.split(' ');

    return (
        <p className={className}>
            {words.map((word, i) => (
                <span key={i} style={{ display: 'inline-block', overflow: 'hidden' }}>
                    <Word word={word} delay={i * delay} />
                    <span style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>
                </span>
            ))}
        </p>
    );
};

const Word = ({ word, delay }: { word: string; delay: number }) => {
    const [springs, api] = useSpring(() => ({
        from: { transform: 'translate3d(0,40px,0)', opacity: 0 },
        to: { transform: 'translate3d(0,0px,0)', opacity: 1 },
        delay,
        config: { tension: 300, friction: 20 },
    }));

    return (
        <animated.span style={springs} className="inline-block">
            {word}
        </animated.span>
    );
};
