import { Outlet, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold">
              My App
            </Link>
            
            <div className="flex items-center gap-4">
              <Button 
                variant={location.pathname === '/' ? 'default' : 'ghost'}
                asChild
              >
                <Link to="/">Home</Link>
              </Button>
              <Button 
                variant={location.pathname === '/about' ? 'default' : 'ghost'}
                asChild
              >
                <Link to="/about">About</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>
      
      <main>
        <Outlet />
      </main>
      
      <footer className="border-t bg-muted/50 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 My App. Built with React + TypeScript + Vite.</p>
        </div>
      </footer>
    </div>
  )
} 