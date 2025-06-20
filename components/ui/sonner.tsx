"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"
import { CircleCheck, TriangleAlert } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      icons={{
        success: <CircleCheck className="w-4 h-4 text-green-600" />,
        error: <TriangleAlert className="w-4 h-4 text-red-600" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
