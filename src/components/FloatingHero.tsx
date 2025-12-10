import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import pixifyLogo from "@/assets/pixify-logo-hero.png";

interface FloatingImageProps {
  src: string;
  index: number;
  totalImages: number;
  isHovering: boolean;
  mouseX: number;
  mouseY: number;
  containerRect: DOMRect | null;
  orbitOffset: number;
  hasEntered: boolean;
}

// Get orbit position - always around the logo, never behind
const getOrbitPosition = (index: number, total: number, radius: number, offset: number) => {
  const angle = ((index / total) * Math.PI * 2) + offset;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
};

// Entry position - half from left, half from right
const getEntryPosition = (index: number) => {
  const isLeftSide = index % 2 === 0;
  return {
    x: isLeftSide ? -600 : 600,
    y: 100 + (index * 30),
  };
};

// Random floating offset for organic movement
const getRandomFloat = (index: number, time: number) => {
  const speed = 0.5 + (index % 3) * 0.2;
  const amplitude = 15 + (index % 4) * 5;
  return {
    x: Math.sin(time * speed + index * 1.5) * amplitude,
    y: Math.cos(time * speed * 0.8 + index * 2) * amplitude,
  };
};

const FloatingImage = ({ 
  src, 
  index,
  totalImages,
  isHovering,
  mouseX,
  mouseY,
  containerRect,
  orbitOffset,
  hasEntered,
}: FloatingImageProps) => {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [floatTime, setFloatTime] = useState(0);
  
  // Animate floating effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatTime(prev => prev + 0.05);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Orbit radius - keep images around logo
  const orbitRadius = 220 + (index % 3) * 40;
  const orbitPosition = getOrbitPosition(index, totalImages, orbitRadius, orbitOffset);
  const entryPosition = getEntryPosition(index);
  const floatOffset = getRandomFloat(index, floatTime);
  
  // Calculate final position
  const position = hasEntered 
    ? { 
        x: orbitPosition.x + floatOffset.x, 
        y: orbitPosition.y + floatOffset.y 
      }
    : entryPosition;
  
  // Calculate repulsion from mouse
  const getRepulsion = () => {
    if (!isHovering || !containerRect || isImageHovered || !hasEntered) return { x: 0, y: 0 };
    
    const centerX = containerRect.width / 2 + position.x;
    const centerY = containerRect.height / 2 + position.y;
    
    const dx = centerX - mouseX;
    const dy = centerY - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const maxDistance = 200;
    const minDistance = 50;
    
    if (distance > maxDistance) return { x: 0, y: 0 };
    
    const normalizedDistance = Math.max(distance, minDistance);
    const strength = Math.pow((maxDistance - normalizedDistance) / maxDistance, 1.5) * 120;
    
    const angle = Math.atan2(dy, dx);
    return {
      x: Math.cos(angle) * strength,
      y: Math.sin(angle) * strength
    };
  };

  const repulsion = getRepulsion();
  const size = 80 + (index % 3) * 25;
  
  // Fly away position when hovered
  const flyAwayAngle = (index / totalImages) * Math.PI * 2;
  const flyAwayDistance = 500;

  return (
    <motion.div
      className="absolute rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
      style={{
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        zIndex: isImageHovered ? 50 : 10 + index,
      }}
      initial={{ 
        opacity: 0, 
        scale: 0.5, 
        x: `calc(-50% + ${entryPosition.x}px)`,
        y: `calc(-50% + ${entryPosition.y}px)`,
        rotate: entryPosition.x < 0 ? -30 : 30,
      }}
      animate={isImageHovered ? {
        x: `calc(-50% + ${Math.cos(flyAwayAngle) * flyAwayDistance}px)`,
        y: `calc(-50% + ${Math.sin(flyAwayAngle) * flyAwayDistance}px)`,
        scale: 0.3,
        opacity: 0.4,
        rotate: 180,
      } : { 
        opacity: 1, 
        scale: 1,
        x: `calc(-50% + ${position.x + repulsion.x}px)`,
        y: `calc(-50% + ${position.y + repulsion.y}px)`,
        rotate: orbitOffset * 15 + index * 5,
      }}
      transition={isImageHovered ? {
        type: "spring",
        stiffness: 80,
        damping: 15,
      } : { 
        opacity: { duration: 0.8, delay: index * 0.1 },
        scale: { duration: 0.8, delay: index * 0.1, type: "spring", stiffness: 150 },
        x: { type: "spring", stiffness: 60, damping: 20, delay: hasEntered ? 0 : index * 0.1 },
        y: { type: "spring", stiffness: 60, damping: 20, delay: hasEntered ? 0 : index * 0.1 },
        rotate: { type: "spring", stiffness: 50, damping: 15 },
      }}
      onHoverStart={() => setIsImageHovered(true)}
      onHoverEnd={() => setIsImageHovered(false)}
    >
      <img src={src} alt="" className="w-full h-full object-cover" />
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-primary/30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isImageHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

export const FloatingHero = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [orbitOffset, setOrbitOffset] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const floatingImages = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop",
  ];

  // Trigger entry animation and continuous orbit
  useEffect(() => {
    // Start entry after a brief delay
    const entryTimer = setTimeout(() => {
      setHasEntered(true);
    }, 500);

    // Continuous slow orbit rotation
    const orbitInterval = setInterval(() => {
      setOrbitOffset(prev => prev + 0.008);
    }, 16);

    return () => {
      clearTimeout(entryTimer);
      clearInterval(orbitInterval);
    };
  }, []);

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
      {/* Floating images - always around the logo */}
      {floatingImages.map((src, idx) => (
        <FloatingImage
          key={idx}
          src={src}
          index={idx}
          totalImages={floatingImages.length}
          isHovering={isHovering}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          containerRect={containerRef.current?.getBoundingClientRect() || null}
          orbitOffset={orbitOffset}
          hasEntered={hasEntered}
        />
      ))}

      {/* Center Pixify Logo - Always on top */}
      <motion.div
        className="relative z-30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <motion.img 
          src={pixifyLogo} 
          alt="Pixify" 
          className="w-[200px] md:w-[300px] lg:w-[350px] h-auto dark:invert relative z-10"
          animate={{ 
            scale: isHovering ? 1.05 : 1,
            filter: "drop-shadow(0 0 20px hsl(var(--primary) / 0.3))",
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20,
          }}
        />
      </motion.div>
    </div>
  );
};
