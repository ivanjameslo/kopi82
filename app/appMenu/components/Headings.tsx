import React from 'react'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface HeadingProps {
  level: HeadingLevel
  children: React.ReactNode
  className?: string
}

export default function Heading({ level, children, className = '' }: HeadingProps) {
  const Component = level as keyof JSX.IntrinsicElements

  const title = "font-bold leading-tight"
  const levelStyles = {
    h1: 'text-4xl mb-4',
    h2: 'text-3xl mb-3',
    h3: 'text-2xl mb-2',
    h4: 'text-xl mb-2',
    h5: 'text-lg mb-1',
    h6: 'text-base mb-1',
  }

  const combinedClassName = `${title} ${levelStyles[level]} ${className}`.trim()

  return (
    <Component className={combinedClassName}>
      {children}
    </Component>
  )
}