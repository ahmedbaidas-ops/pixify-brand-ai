import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import pixifyLogo from "@/assets/pixify-logo-hero.png";

interface FloatingImageProps {
  src: string;
  initialX: number;
  initialY: number;
  size: number;
  delay: number;
  isHovering: boolean;
  mouseX: number;
  mouseY: number;
  containerRect: DOMRect | null;
}

const FloatingImage = ({ 
  src, 
  initialX, 
  initialY, 
  size, 
  delay, 
  isHovering,
  mouseX,
  mouseY,
  containerRect
}: FloatingImageProps) => {
  const floatY = useMotionValue(0);
  
  // Calculate repulsion from mouse
  const getRepulsion = () => {
    if (!isHovering || !containerRect) return { x: 0, y: 0 };
    
    const centerX = containerRect.width / 2 + initialX;
    const centerY = containerRect.height / 2 + initialY;
    
    const dx = centerX - mouseX;
    const dy = centerY - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const maxDistance = 300;
    const strength = Math.max(0, (maxDistance - distance) / maxDistance) * 80;
    
    const angle = Math.atan2(dy, dx);
    return {
      x: Math.cos(angle) * strength,
      y: Math.sin(angle) * strength
    };
  };

  const repulsion = getRepulsion();

  return (
    <motion.div
      className="absolute rounded-2xl overflow-hidden shadow-2xl"
      style={{
        width: size,
        height: size,
        left: `calc(50% + ${initialX}px)`,
        top: `calc(50% + ${initialY}px)`,
        x: "-50%",
        y: "-50%",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: `calc(-50% + ${repulsion.x}px)`,
        y: `calc(-50% + ${repulsion.y}px)`,
      }}
      transition={{ 
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay, type: "spring", stiffness: 200 },
        x: { type: "spring", stiffness: 150, damping: 15 },
        y: { type: "spring", stiffness: 150, damping: 15 },
      }}
    >
      <motion.div
        className="w-full h-full"
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          duration: 3 + Math.random() * 2, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: delay 
        }}
      >
        <img src={src} alt="" className="w-full h-full object-cover" />
      </motion.div>
    </motion.div>
  );
};

export const FloatingHero = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const floatingImages = [
    { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop", x: -320, y: -180, size: 140 },
    { src: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400&h=400&fit=crop", x: 280, y: -200, size: 120 },
    { src: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&h=400&fit=crop", x: -380, y: 80, size: 100 },
    { src: "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400&h=400&fit=crop", x: 350, y: 120, size: 130 },
    { src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=400&fit=crop", x: -180, y: 220, size: 110 },
    { src: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=400&h=400&fit=crop", x: 180, y: 240, size: 95 },
    { src: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop", x: -450, y: -50, size: 80 },
    { src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop", x: 420, y: -40, size: 90 },
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Floating images */}
      {floatingImages.map((img, idx) => (
        <FloatingImage
          key={idx}
          src={img.src}
          initialX={img.x}
          initialY={img.y}
          size={img.size}
          delay={0.1 + idx * 0.1}
          isHovering={isHovering}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          containerRect={containerRef.current?.getBoundingClientRect() || null}
        />
      ))}

      {/* Center Pixify Logo */}
      <motion.div
        className="relative z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
      >
        <motion.img 
          src={pixifyLogo} 
          alt="Pixify" 
          className="w-[280px] md:w-[400px] lg:w-[500px] h-auto dark:invert"
          animate={{ 
            scale: isHovering ? 1.05 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </motion.div>
    </div>
  );
};
