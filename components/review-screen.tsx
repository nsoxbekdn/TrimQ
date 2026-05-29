"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewScreenProps {
  shopName: string;
  onSubmit: (rating: number, comment: string) => void;
  onSkip: () => void;
}

export function ReviewScreen({ shopName, onSubmit, onSkip }: ReviewScreenProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const displayRating = hoverRating || rating;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[100dvh] flex-col bg-background px-5 py-safe"
    >
      {/* Skip button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onSkip}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-forest"
        >
          Skip
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center pb-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-lime"
        >
          <span className="text-4xl">✂️</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center font-serif text-2xl text-forest"
        >
          How was your visit?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-center text-muted-foreground"
        >
          Rate your experience at {shopName}
        </motion.p>

        {/* Star rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex gap-3"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-1"
            >
              <Star
                className={cn(
                  "h-10 w-10 transition-all duration-200",
                  star <= displayRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                )}
              />
            </motion.button>
          ))}
        </motion.div>

        {/* Rating text */}
        <motion.p
          key={displayRating}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 h-6 text-sm font-medium text-forest"
        >
          {displayRating === 1 && "Poor"}
          {displayRating === 2 && "Fair"}
          {displayRating === 3 && "Good"}
          {displayRating === 4 && "Great"}
          {displayRating === 5 && "Excellent!"}
        </motion.p>

        {/* Comment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 w-full max-w-md"
        >
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment (optional)"
            rows={3}
            className="w-full resize-none rounded-xl border-2 border-transparent bg-card p-4 text-forest shadow-[0_2px_10px_rgba(28,58,42,0.06)] transition-all placeholder:text-muted-foreground/50 focus:border-lime focus:outline-none focus:ring-0"
          />
        </motion.div>
      </div>

      {/* Submit button */}
      <div className="pb-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={rating > 0 ? { scale: 1.02 } : undefined}
          whileTap={rating > 0 ? { scale: 0.98 } : undefined}
          onClick={() => rating > 0 && onSubmit(rating, comment)}
          disabled={rating === 0}
          className={cn(
            "w-full rounded-2xl py-4 font-semibold shadow-lg transition-all",
            rating > 0
              ? "bg-forest text-white"
              : "bg-muted text-muted-foreground"
          )}
        >
          Submit Review
        </motion.button>
      </div>
    </motion.div>
  );
}
