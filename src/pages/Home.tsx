import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="container mx-auto py-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to Your App</h1>
        <p className="text-muted-foreground text-lg">
          React + TypeScript + Tailwind CSS + Vite
        </p>
        
        <div className="flex justify-center gap-4">
          <Button onClick={() => setCount(count + 1)}>
            Count: {count}
          </Button>
          <Button variant="outline">
            Secondary Button
          </Button>
        </div>
      </div>
    </div>
  )
} 