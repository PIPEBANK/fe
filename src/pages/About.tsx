export default function About() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto prose dark:prose-invert">
        <h1>About</h1>
        <p>
          This is a modern React application built with the latest technologies:
        </p>
        <ul>
          <li>React 19 with TypeScript</li>
          <li>Vite for fast development</li>
          <li>Tailwind CSS for styling</li>
          <li>shadcn/ui components</li>
          <li>React Router DOM for routing</li>
        </ul>
      </div>
    </div>
  )
} 