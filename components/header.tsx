import { Button } from "@/components/ui/button"


export function Header() {
  return (
    <header className="h-16 border-b bg-white px-4">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-4xl">🗺️ </p>
            <p className="flex">OuiMap</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button disabled size="sm">🎉</Button>
        </div>
      </div>
    </header>
  )
}

