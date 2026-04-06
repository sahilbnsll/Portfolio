"use client";

import { Button } from "@/components/ui/Button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { animate, motion, useDragControls, useMotionValue, useTransform } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import ImageWithSkeleton from "./ImageWithSkeleton";

interface SwipeCardsProps {
  className?: string;
}

const SwipeCards = ({ className }: SwipeCardsProps) => {
  const [cards, setCards] = useState<Card[]>(cardData);
  const [viewportWidth, setViewportWidth] = useState(1024);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const syncViewport = () => setViewportWidth(window.innerWidth);

    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

  const deckConfig = useMemo(() => {
    if (isMobile) {
      return {
        height: 212,
        visibleCount: 4,
        swipeDistance: 220,
        swipeThreshold: 72,
        width: 156,
      };
    }

    if (isTablet) {
      return {
        height: 224,
        visibleCount: 5,
        swipeDistance: 260,
        swipeThreshold: 88,
        width: 168,
      };
    }

    return {
      height: 233,
      visibleCount: 8,
      swipeDistance: 280,
      swipeThreshold: 100,
      width: 175,
    };
  }, [isMobile, isTablet]);

  const visibleCards = cards.slice(-deckConfig.visibleCount);
  const hiddenCardsCount = Math.max(0, cards.length - visibleCards.length);

  const resetCards = () => {
    setCards(cardData);
  };

  return (
    <div
      className={cn(
        "relative grid place-items-center select-none",
        className,
      )}
      style={{
        height: deckConfig.height,
        width: deckConfig.width,
      }}
    >
      <div className="pointer-events-none absolute inset-x-3 bottom-0 top-6 rounded-[28px] bg-gradient-to-b from-background/10 via-background/10 to-background/0 blur-2xl" />
      {hiddenCardsCount > 0 && (
        <div className="pointer-events-none absolute -top-3 right-0 z-30 rounded-full border border-border/60 bg-background/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground shadow-sm backdrop-blur-sm">
          +{hiddenCardsCount} more
        </div>
      )}
      {cards.length === 0 && (
        <div style={{ gridRow: 1, gridColumn: 1 }} className="z-20">
          <Button onClick={resetCards} variant={"outline"}>
            <RefreshCw className="size-4" />
            Again
          </Button>
        </div>
      )}
      {visibleCards.map((card, index) => {
        const depth = visibleCards.length - 1 - index;
        return (
          <Card
            key={card.id}
            cards={cards}
            cardHeight={deckConfig.height}
            cardWidth={deckConfig.width}
            depth={depth}
            isCompact={isMobile}
            prefersReducedMotion={prefersReducedMotion}
            setCards={setCards}
            swipeDistance={deckConfig.swipeDistance}
            swipeThreshold={deckConfig.swipeThreshold}
            {...card}
          />
        );
      })}
    </div>
  );
};

const Card = ({
  id,
  url,
  setCards,
  cards,
  cardHeight,
  cardWidth,
  depth,
  isCompact,
  prefersReducedMotion,
  swipeDistance,
  swipeThreshold,
}: {
  id: number;
  url: string;
  setCards: Dispatch<SetStateAction<Card[]>>;
  cards: Card[];
  cardHeight: number;
  cardWidth: number;
  depth: number;
  isCompact: boolean;
  prefersReducedMotion: boolean;
  swipeDistance: number;
  swipeThreshold: number;
}) => {
  const x = useMotionValue(0);
  const dragControls = useDragControls();

  const rotateRaw = useTransform(
    x,
    [-swipeDistance, swipeDistance],
    [-14, 14],
  );
  const opacity = useTransform(
    x,
    [-swipeThreshold, 0, swipeThreshold],
    [0.2, 1, 0.2],
  );

  const isFront = id === cards[cards.length - 1]?.id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : id % 2 ? 4.5 : -4.5;
    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = (_event: PointerEvent, info: { offset: { x: number }, velocity: { x: number } }) => {
    const shouldDismiss =
      Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > 520;

    if (shouldDismiss) {
      const direction = info.offset.x >= 0 ? 1 : -1;

      animate(x, direction * swipeDistance, {
        type: "spring",
        stiffness: 260,
        damping: 26,
        mass: 0.32,
        onComplete: () => {
          setCards((pv) => pv.filter((v) => v.id !== id));
        },
      });
    } else {
      animate(x, 0, {
        type: "spring",
        stiffness: 430,
        damping: 34,
        mass: 0.3,
      });
    }
  };

  return (
    <motion.div
      className="group absolute origin-bottom overflow-hidden rounded-[20px] bg-white ring-1 ring-black/5 transition-all duration-300 ease-out will-change-transform hover:cursor-grab active:cursor-grabbing"
      style={{
        gridRow: 1,
        gridColumn: 1,
        height: cardHeight,
        width: cardWidth,
        x,
        opacity,
        rotate,
        boxShadow: isFront
          ? "0 16px 30px -18px rgb(15 23 42 / 0.55), 0 10px 24px -18px rgb(15 23 42 / 0.45)"
          : "0 10px 20px -18px rgb(15 23 42 / 0.4)",
        touchAction: isFront ? "pan-y" : "auto",
      }}
      animate={{
        scale: isFront ? 1 : Math.max(0.88, 0.96 - depth * 0.035),
        y: isFront ? 0 : Math.min(depth * 5, 14),
      }}
      whileHover={
        isFront && !isCompact && !prefersReducedMotion
          ? {
            scale: 1.035,
            boxShadow:
              "0 26px 38px -18px rgb(15 23 42 / 0.55), 0 18px 30px -22px rgb(15 23 42 / 0.48)",
            transition: { duration: 0.24, ease: "easeOut" },
          }
          : undefined
      }
      whileTap={isFront ? { scale: 1.01 } : undefined}
      drag={isFront ? "x" : false}
      dragControls={dragControls}
      dragElastic={0.08}
      dragListener={false}
      dragMomentum={false}
      onPointerDown={(e) => { if (isFront) dragControls.start(e); }}
      dragConstraints={{
        left: -swipeDistance,
        right: swipeDistance,
        top: 0,
        bottom: 0,
      }}
      onDragEnd={handleDragEnd}
    >
      {isFront ? (
        <ImageWithSkeleton
          src={url}
          alt="Photo of Sahil"
          width={cardWidth}
          height={cardHeight}
          sizes={`${cardWidth}px`}
          quality={isCompact ? 68 : 75}
          draggable={false}
          containerClassName="h-full w-full pointer-events-none"
          className="h-full w-full select-none object-cover"
          fetchPriority="high"
          priority
        />
      ) : (
        <ImageWithSkeleton
          src={url}
          alt=""
          width={cardWidth}
          height={cardHeight}
          sizes={`${cardWidth}px`}
          quality={isCompact ? 60 : 68}
          draggable={false}
          containerClassName="h-full w-full pointer-events-none"
          className="h-full w-full select-none object-cover"
          fetchPriority="low"
          loading="lazy"
        />
      )}
    </motion.div>
  );
};

export default SwipeCards;

type Card = {
  id: number;
  url: string;
};

const cardData: Card[] = [
  {
    id: 1,
    url: "/img/sahil8.jpeg",
  },
  {
    id: 2,
    url: "/img/sahil7.jpeg",
  },
  {
    id: 3,
    url: "/img/sahil6.jpeg",
  },
  {
    id: 4,
    url: "/img/sahil5.jpeg",
  },
  {
    id: 5,
    url: "/img/sahil4.jpeg",
  },
  {
    id: 6,
    url: "/img/sahil3.jpeg",
  },
  {
    id: 7,
    url: "/img/sahil2.jpeg",
  },
  {
    id: 8,
    url: "/img/sahil1.jpeg",
  }
];
