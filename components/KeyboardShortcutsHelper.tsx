"use client"

import { useState } from "react"
import { Keyboard, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ShortcutCategory = {
  name: string
  shortcuts: {
    keys: string[]
    description: string
  }[]
}

const KEYBOARD_SHORTCUTS: ShortcutCategory[] = [
  {
    name: "Navigation",
    shortcuts: [
      { keys: ["g", "h"], description: "Go to Home" },
      { keys: ["g", "b"], description: "Go to Battlers" },
      { keys: ["g", "a"], description: "Go to Analytics" },
      { keys: ["g", "l"], description: "Go to Leaderboard" },
      { keys: ["g", "p"], description: "Go to Profile" },
    ],
  },
  {
    name: "Actions",
    shortcuts: [
      { keys: ["n", "r"], description: "New Rating" },
      { keys: ["n", "c"], description: "New Content" },
      { keys: ["s"], description: "Search" },
      { keys: ["?"], description: "Show Keyboard Shortcuts" },
      { keys: ["Esc"], description: "Close Dialog / Cancel" },
    ],
  },
  {
    name: "Admin",
    shortcuts: [
      { keys: ["a", "b"], description: "Add Battler" },
      { keys: ["a", "t"], description: "Manage Tags" },
      { keys: ["a", "u"], description: "Manage Users" },
      { keys: ["a", "d"], description: "Data Tools" },
      { keys: ["a", "c"], description: "Community Manager Requests" },
    ],
  },
]

export default function KeyboardShortcutsHelper() {
  const [open, setOpen] = useState(false)

  // Add global keyboard listener for '?' key
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", (e) => {
      if (e.key === "?" && !open) {
        setOpen(true)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Keyboard shortcuts">
          <Keyboard className="h-5 w-5 text-gray-400 hover:text-gray-100" />
          <HelpCircle className="h-3 w-3 absolute bottom-0 right-0 text-blue-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>Use these keyboard shortcuts to navigate and perform actions quickly.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {KEYBOARD_SHORTCUTS.map((category) => (
            <div key={category.name} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{category.name}</h3>
              <div className="rounded-md border">
                {category.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 ${
                      index !== category.shortcuts.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd
                          key={keyIndex}
                          className="inline-flex h-5 items-center justify-center rounded border bg-gray-100 px-1.5 text-xs font-medium text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Press{" "}
          <kbd className="px-1 py-0.5 rounded border bg-gray-100 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
            ?
          </kbd>{" "}
          anywhere to open this dialog
        </div>
      </DialogContent>
    </Dialog>
  )
}

