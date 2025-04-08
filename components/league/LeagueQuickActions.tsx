"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Video, TrendingUp, Plus, Edit } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Event {
  id: string
  title: string
  date: string
  location: string
  status: "upcoming" | "past" | "live"
}

export default function LeagueQuickActions() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("upcoming")

  // Mock events data
  const events: Event[] = [
    {
      id: "1",
      title: "Summer Madness 12",
      date: "2023-08-15",
      location: "New York, NY",
      status: "upcoming",
    },
    {
      id: "2",
      title: "NOME XIII",
      date: "2023-06-03",
      location: "Houston, TX",
      status: "past",
    },
    {
      id: "3",
      title: "Double Impact 5",
      date: "2023-09-23",
      location: "Atlanta, GA",
      status: "upcoming",
    },
  ]

  const filteredEvents = events.filter((event) => event.status === activeTab)

  if (!user || user.role !== 'league_owner') {
    return null
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-amber-500" />
            League Events
          </CardTitle>
          <Button size="sm" variant="outline" className="h-8">
            <Plus className="h-4 w-4 mr-1" />
            New Event
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="upcoming" className="flex-1">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="live" className="flex-1">
                Live
              </TabsTrigger>
              <TabsTrigger value="past" className="flex-1">
                Past
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming" className="m-0">
            {filteredEvents.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <p>No upcoming events</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="p-4 hover:bg-gray-800/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="h-8">
                        <Users className="h-4 w-4 mr-1" />
                        Battlers
                      </Button>
                      <Button size="sm" variant="outline" className="h-8">
                        <Video className="h-4 w-4 mr-1" />
                        Media
                      </Button>
                      <Button size="sm" variant="outline" className="h-8">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Stats
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="live" className="m-0">
            <div className="py-8 text-center text-gray-400">
              <p>No live events</p>
            </div>
          </TabsContent>

          <TabsContent value="past" className="m-0">
            {events.filter((e) => e.status === "past").length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <p>No past events</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {events
                  .filter((e) => e.status === "past")
                  .map((event) => (
                    <div key={event.id} className="p-4 hover:bg-gray-800/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="flex items-center text-sm text-gray-400 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Results
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

