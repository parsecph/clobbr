import './styles.css';
import { Suspense, useState } from 'react';
import { motion, MotionConfig, useMotionValue } from 'framer-motion';
import { Shapes } from './Shapes';
import { transition } from './settings';
import useMeasure from 'react-use-measure';

export default function Intro() {
  const [ref, bounds] = useMeasure({ scroll: false });
  const [isHover, setIsHover] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const resetMousePosition = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="w-full flex items-center justify-center py-36">
      <MotionConfig transition={transition}>
        <motion.button
          ref={ref}
          initial={false}
          animate={isHover ? 'hover' : 'rest'}
          whileTap="press"
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.1 },
            press: { scale: 1.2 }
          }}
          onHoverStart={() => {
            resetMousePosition();
            setIsHover(true);
          }}
          onHoverEnd={() => {
            resetMousePosition();
            setIsHover(false);
          }}
          onTapStart={() => setIsPress(true)}
          onTap={() => setIsPress(false)}
          onTapCancel={() => setIsPress(false)}
          onPointerMove={(e) => {
            mouseX.set(e.clientX - bounds.x - bounds.width / 3);
            mouseY.set(e.clientY - bounds.y - bounds.height / 3);
          }}
        >
          <motion.div
            className="shapes"
            variants={{
              rest: { opacity: 0 },
              hover: { opacity: 1 }
            }}
          >
            <div className="primary blush" />
            <div className="tertiary blush" />
            <div className="container">
              <Suspense fallback={null}>
                <Shapes
                  isHover={isHover}
                  isPress={isPress}
                  mouseX={mouseX}
                  mouseY={mouseY}
                />
              </Suspense>
            </div>
          </motion.div>
          <motion.div
            variants={{ hover: { scale: 0.85 }, press: { scale: 1 } }}
            className="label"
          >
            Get started
          </motion.div>
        </motion.button>
      </MotionConfig>
    </div>
  );
}
