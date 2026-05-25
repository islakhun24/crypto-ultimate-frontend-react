import * as React from "react"
import { cn } from "@/lib/utils"

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  className?: string
}

function Tooltip({ content, children, className }: TooltipProps) {
  const [show, setShow] = React.useState(false)

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs bg-popover text-popover-foreground rounded-md shadow-md border whitespace-nowrap">
          {content}
        </div>
      )}
    </div>
  )
}

export { Tooltip }
