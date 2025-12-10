import { motion, useAnimationControls } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import pixifyLogo from "@/assets/pixify-logo-hero.png";

interface FloatingImageProps {
  src: string;
  index: number;
  totalImages: number;
  animationPhase: "heart" | "floating" | "circle";
  isHovering: boolean;
  mouseX: number;
  mouseY: number;
  containerRect: DOMRect | null;
}

// Heart shape parametric equation
const getHeartPosition = (index: number, total: number, scale: number = 200) => {
  const t = (index / total) * Math.PI * 2;
  const x = scale * 16 * Math.pow(Math.sin(t), 3) / 16;
  const y = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16;
  return { x, y };
};

// Circle positions
const getCirclePosition = (index: number, total: number, radius: number = 220, offset: number = 0) => {
  const angle = ((index / total) * Math.PI * 2) + offset;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius
  };
};

// Floating positions (scattered)
const floatingPositions = [
  { x: -320, y: -180 },
  { x: 280, y: -200 },
  { x: -380, y: 80 },
  { x: 350, y: 120 },
  { x: -180, y: 220 },
  { x: 180, y: 240 },
  { x: -450, y: -50 },
  { x: 420, y: -40 },
];

const FloatingImage = ({ 
  src, 
  index,
  totalImages,
  animationPhase,
  isHovering,
  mouseX,
  mouseY,
  containerRect
}: FloatingImageProps) => {
  const [circleOffset, setCircleOffset] = useState(0);
  
  // Animate circle rotation
  useEffect(() => {
    if (animationPhase === "circle") {
      const interval = setInterval(() => {
        setCircleOffset(prev => prev + 0.02);
      }, 16);
      return () => clearInterval(interval);
    }
  }, [animationPhase]);

  // Calculate position based on animation phase
  const getPosition = () => {
    switch (animationPhase) {
      case "heart":
        return getHeartPosition(index, totalImages, 180);
      case "circle":
        return getCirclePosition(index, totalImages, 220, circleOffset);
      case "floating":
      default:
        return floatingPositions[index] || { x: 0, y: 0 };
    }
  };

  const position = getPosition();
  
  // Calculate repulsion from mouse (only in floating phase)
  const getRepulsion = () => {
    if (!isHovering || !containerRect || animationPhase !== "floating") return { x: 0, y: 0 };
    
    const centerX = containerRect.width / 2 + position.x;
    const centerY = containerRect.height / 2 + position.y;
    
    const dx = centerX - mouseX;
    const dy = centerY - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const maxDistance = 300;
    const strength = Math.max(0, (maxDistance - distance) / maxDistance) * 60;
    
    const angle = Math.atan2(dy, dx);
    return {
      x: Math.cos(angle) * strength,
      y: Math.sin(angle) * strength
    };
  };

  const repulsion = getRepulsion();
  const size = 90 + (index % 3) * 20;

  return (
    <motion.div
      className="absolute rounded-2xl overflow-hidden shadow-2xl"
      style={{
        width: size,
        height: size,
        left: "50%",
        top: "50%",
      }}
      initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: `calc(-50% + ${position.x + repulsion.x}px)`,
        y: `calc(-50% + ${position.y + repulsion.y}px)`,
        rotate: animationPhase === "circle" ? circleOffset * 30 : 0,
      }}
      transition={{ 
        opacity: { duration: 0.6, delay: index * 0.1 },
        scale: { duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 200 },
        x: { type: "spring", stiffness: 100, damping: 20 },
        y: { type: "spring", stiffness: 100, damping: 20 },
        rotate: { duration: 0.3 },
      }}
    >
      <motion.div
        className="w-full h-full"
        animate={animationPhase === "floating" ? { y: [0, -8, 0] } : {}}
        transition={{ 
          duration: 2.5 + Math.random() * 1.5, 
          repeat: Infinity, 
          ease: "easeInOut",
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
  const [animationPhase, setAnimationPhase] = useState<"heart" | "floating" | "circle">("heart");
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

  // Animation cycle: heart (20s) -> floating (10s) -> circle (10s) -> floating (10s) -> repeat
  useEffect(() => {
    const cycleAnimation = () => {
      // Start with heart shape
      setAnimationPhase("heart");
      
      setTimeout(() => {
        // After 20s, switch to floating
        setAnimationPhase("floating");
        
        setTimeout(() => {
          // After 10s of floating, switch to circle
          setAnimationPhase("circle");
          
          setTimeout(() => {
            // After 10s of circle, switch back to floating
            setAnimationPhase("floating");
            
            setTimeout(() => {
              // After 10s of floating, restart cycle
              cycleAnimation();
            }, 10000);
          }, 10000);
        }, 10000);
      }, 20000);
    };

    cycleAnimation();
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
      {/* Floating images */}
      {floatingImages.map((src, idx) => (
        <FloatingImage
          key={idx}
          src={src}
          index={idx}
          totalImages={floatingImages.length}
          animationPhase={animationPhase}
          isHovering={isHovering}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          containerRect={containerRef.current?.getBoundingClientRect() || null}
        />
      ))}

      {/* Center Pixify Logo - Always visible */}
      <motion.div
        className="relative z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
      >
        <motion.img 
          src={pixifyLogo} 
          alt="Pixify" 
          className="w-[200px] md:w-[300px] lg:w-[350px] h-auto dark:invert"
          animate={{ 
            scale: isHovering ? 1.05 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </motion.div>

      {/* Animation phase indicator (subtle) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {["heart", "floating", "circle"].map((phase) => (
          <motion.div
            key={phase}
            className={`w-2 h-2 rounded-full ${animationPhase === phase ? 'bg-foreground' : 'bg-foreground/20'}`}
            animate={{ scale: animationPhase === phase ? 1.2 : 1 }}
          />
        ))}
      </div>
    </div>
  );
};
