# Motion Components

This directory contains reusable animation components built with Motion (formerly Framer Motion) for the PropertyWise application.

## Installation

Motion is already installed in the project:
```bash
npm install motion
```

> **Note**: This project uses the new `motion` package, which is the successor to `framer-motion`. The API is largely the same, but imports come from `motion/react` instead of `framer-motion`.

## Components

### PageTransition
A page-level transition component that provides smooth enter/exit animations for route changes.

```tsx
import { PageTransition } from "@/components/motion";

export default function MyPage() {
  return (
    <PageTransition>
      <div>Your page content</div>
    </PageTransition>
  );
}
```

**Props:**
- `children`: ReactNode - The content to animate
- `className?`: string - Optional CSS classes

### FadeIn
Smoothly fades in content with customizable timing.

```tsx
import { FadeIn } from "@/components/motion";

<FadeIn delay={0.2} duration={0.8}>
  <div>Content that fades in</div>
</FadeIn>
```

**Props:**
- `children`: ReactNode - The content to animate
- `delay?`: number - Delay before animation starts (default: 0)
- `duration?`: number - Animation duration (default: 0.5)
- `className?`: string - Optional CSS classes

### SlideIn
Slides content in from different directions.

```tsx
import { SlideIn } from "@/components/motion";

<SlideIn direction="up" delay={0.1} distance={30}>
  <div>Content that slides in</div>
</SlideIn>
```

**Props:**
- `children`: ReactNode - The content to animate
- `direction?`: "up" | "down" | "left" | "right" - Slide direction (default: "up")
- `delay?`: number - Delay before animation starts (default: 0)
- `duration?`: number - Animation duration (default: 0.6)
- `distance?`: number - Distance to slide (default: 50)
- `className?`: string - Optional CSS classes

### ScaleIn
Scales content in with a zoom effect.

```tsx
import { ScaleIn } from "@/components/motion";

<ScaleIn delay={0.3} initialScale={0.9}>
  <div>Content that scales in</div>
</ScaleIn>
```

**Props:**
- `children`: ReactNode - The content to animate
- `delay?`: number - Delay before animation starts (default: 0)
- `duration?`: number - Animation duration (default: 0.5)
- `initialScale?`: number - Starting scale value (default: 0.8)
- `className?`: string - Optional CSS classes

### CardMotion
Specialized animation for card components with hover effects.

```tsx
import { CardMotion } from "@/components/motion";

<CardMotion delay={0.2} whileHover={true}>
  <Card>Card content</Card>
</CardMotion>
```

**Props:**
- `children`: ReactNode - The content to animate
- `delay?`: number - Delay before animation starts (default: 0)
- `whileHover?`: boolean - Enable hover animation (default: true)
- `className?`: string - Optional CSS classes

### StaggerContainer
Creates staggered animations for multiple child elements.

```tsx
import { StaggerContainer } from "@/components/motion";

<StaggerContainer delayChildren={0.2} staggerChildren={0.1}>
  <div>First item</div>
  <div>Second item</div>
  <div>Third item</div>
</StaggerContainer>
```

**Props:**
- `children`: ReactNode - The content to animate
- `delayChildren?`: number - Delay before children start animating (default: 0)
- `staggerChildren?`: number - Delay between each child animation (default: 0.1)
- `className?`: string - Optional CSS classes

## Usage Examples

### Basic Page Animation
```tsx
import { PageTransition, FadeIn, SlideIn } from "@/components/motion";

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="container">
        <FadeIn>
          <header>Header content</header>
        </FadeIn>
        
        <SlideIn direction="up" delay={0.2}>
          <main>Main content</main>
        </SlideIn>
      </div>
    </PageTransition>
  );
}
```

### Card Grid with Staggered Animation
```tsx
import { StaggerContainer, CardMotion } from "@/components/motion";

export default function CardGrid({ items }: { items: Array<any> }) {
  return (
    <StaggerContainer delayChildren={0.3} staggerChildren={0.1}>
      {items.map((item, index) => (
        <CardMotion key={item.id} delay={0}>
          <Card>
            <CardContent>{item.content}</CardContent>
          </Card>
        </CardMotion>
      ))}
    </StaggerContainer>
  );
}
```

### Form Animation
```tsx
import { FadeIn, SlideIn } from "@/components/motion";

export default function ContactForm() {
  return (
    <div>
      <FadeIn>
        <h2>Contact Us</h2>
      </FadeIn>
      
      <SlideIn direction="up" delay={0.2}>
        <form>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <textarea placeholder="Message" />
          <button type="submit">Send</button>
        </form>
      </SlideIn>
    </div>
  );
}
```

## Best Practices

1. **Performance**: Use these components judiciously. Too many animations can impact performance.

2. **Accessibility**: Consider users who prefer reduced motion. You can add `prefers-reduced-motion` checks:
   ```tsx
   const prefersReducedMotion = useReducedMotion();
   
   <FadeIn duration={prefersReducedMotion ? 0 : 0.5}>
     <div>Content</div>
   </FadeIn>
   ```

3. **Timing**: Use consistent timing across your application:
   - Quick interactions: 0.2-0.3s
   - Page transitions: 0.4-0.6s
   - Complex animations: 0.6-1.0s

4. **Staggering**: When animating lists, use small stagger delays (0.05-0.15s) for smooth effects.

5. **Theme Compatibility**: All components work with both light and dark themes automatically.

## Integration with Next.js

These components are designed to work seamlessly with:
- Next.js 15 App Router
- Server-side rendering (components are marked as "use client")
- TypeScript (full type safety)
- Tailwind CSS (styling compatibility)
- Theme switching (light/dark mode support)

## Troubleshooting

**Common Issues:**

1. **Hydration mismatch**: Make sure components are marked as "use client"
2. **Animation not starting**: Check if parent containers have proper positioning
3. **Performance issues**: Reduce the number of simultaneous animations
4. **Layout shift**: Use `layout` prop in motion components when needed

For more advanced animations, refer to the [Motion documentation](https://motion.dev/).
