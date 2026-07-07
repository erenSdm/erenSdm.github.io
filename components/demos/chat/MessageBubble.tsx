"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "./data";

export function MessageBubble({ message }: { message: Message }) {
  const reduce = useReducedMotion();
  const mine = message.from === "me";
  const hasImage = message.kind === "image" && message.image;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex w-full flex-col",
        mine ? "items-end" : "items-start",
      )}
    >
      <div
        className={cn(
          "max-w-[80%] overflow-hidden text-[14.5px] leading-[1.4]",
          hasImage ? "p-1" : "px-3.5 py-2.5",
          mine
            ? "rounded-[1.25rem] rounded-br-md bg-[#3E6FF0] text-white"
            : "rounded-[1.25rem] rounded-bl-md bg-[#16161A] text-paper ring-1 ring-white/[0.04]",
        )}
      >
        {hasImage && (
          <figure className="overflow-hidden rounded-[0.9rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.image!.src}
              alt={message.image!.alt}
              width={message.image!.w}
              height={message.image!.h}
              loading="lazy"
              className="block h-auto w-full object-cover"
            />
            {message.text && (
              <figcaption className="px-2.5 pb-1.5 pt-2 text-[13.5px] leading-snug text-white/90">
                {message.text}
              </figcaption>
            )}
          </figure>
        )}
        {!hasImage && message.text}
      </div>

      <div
        className={cn(
          "mt-1 flex items-center gap-1 px-1",
          mine ? "flex-row" : "flex-row-reverse",
        )}
      >
        <span className="font-mono text-[10px] tabular-nums tracking-wide text-ash">
          {message.time}
        </span>
        {mine && (
          <CheckCheck
            className={cn(
              "h-3.5 w-3.5",
              message.read ? "text-[#9BB8FF]" : "text-dim",
            )}
            strokeWidth={2}
            aria-label={message.read ? "Read" : "Delivered"}
          />
        )}
      </div>
    </motion.div>
  );
}
