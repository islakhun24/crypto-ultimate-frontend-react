import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  max?: number
  step?: number
  className?: string
}

function Slider({ value, onValueChange, max = 100, step = 1, className }: SliderProps) {
  return (
    <input
      type="range"
      min={0}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      className={cn(
        "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary",
        className
      )}
    />
  )
}

export { Slider }
