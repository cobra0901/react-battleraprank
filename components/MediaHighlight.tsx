"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Video, ExternalLink, ThumbsUp } from "lucide-react"
import Image from "next/image"

interface MediaUser {
  id: string
  name: string
  image: string
  outlet: string
  bio: string
  socialLinks: {
    youtube?: string
    twitter?: string
    instagram?: string
    website?: string
  }
  recentContent: {
    title: string
    url: string
    type: "video" | "article" | "podcast"
    thumbnail?: string
    likes: number
    date: string
  }[]
}

export default function MediaHighlight() {
  const [mediaUsers, setMediaUsers] = useState<MediaUser[]>([])
  const [activeTab, setActiveTab] = useState("featured")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data for media users
    const mockMediaUsers: MediaUser[] = [
      {
        id: "1",
        name: "Jay Blac",
        image: "/placeholder.svg?height=300&width=300",
        outlet: "Champion",
        bio: "Battle rap analyst and host of Champion",
        socialLinks: {
          youtube: "https://youtube.com",
          twitter: "https://twitter.com",
          instagram: "https://instagram.com",
          website: "https://example.com",
        },
        recentContent: [
          {
            title: "Loaded Lux vs Geechi Gotti - Who Really Won?",
            url: "https://youtube.com",
            type: "video",
            thumbnail: "/placeholder.svg?height=180&width=320",
            likes: 1245,
            date: "2 days ago",
          },
          {
            title: "Top 5 Performances of the Month",
            url: "https://youtube.com",
            type: "video",
            thumbnail: "/placeholder.svg?height=180&width=320",
            likes: 987,
            date: "1 week ago",
          },
        ],
      },
      {
        id: "2",
        name: "15 Minutes of Fame",
        image: "/placeholder.svg?height=300&width=300",
        outlet: "15MOF",
        bio: "Battle rap news and interviews",
        socialLinks: {
          youtube: "https://youtube.com",
          twitter: "https://twitter.com",
        },
        recentContent: [
          {
            title: "Exclusive Interview with Tsu Surf",
            url: "https://youtube.com",
            type: "video",
            thumbnail: "/placeholder.svg?height=180&width=320",
            likes: 876,
            date: "3 days ago",
          },
        ],
      },
      {
        id: "3",
        name: "Battle Rap Trap",
        image: "/placeholder.svg?height=300&width=300",
        outlet: "BRT",
        bio: "Battle rap news, reviews, and predictions",
        socialLinks: {
          youtube: "https://youtube.com",
          website: "https://example.com",
        },
        recentContent: [
          {
            title: "Weekly Battle Rap Roundup",
            url: "https://example.com",
            type: "article",
            likes: 543,
            date: "1 day ago",
          },
          {
            title: "Upcoming Battles You Can't Miss",
            url: "https://example.com",
            type: "article",
            likes: 321,
            date: "4 days ago",
          },
        ],
      },
    ]

    setMediaUsers(mockMediaUsers)
    setIsLoading(false)
  }, [])

  return (
    <div>
      <div className="flex items-center mb-4">
        <Video className="w-5 h-5 mr-2 text-purple-500" />
        <h2 className="text-2xl font-bold">Media Spotlight</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-gray-900 border border-gray-800">
          <TabsTrigger value="featured">Featured Media</TabsTrigger>
          <TabsTrigger value="trending">Trending Content</TabsTrigger>
        </TabsList>

        <TabsContent value="featured">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="bg-gray-900 border-gray-800 animate-pulse">
                      <CardContent className="p-0 h-80"></CardContent>
                    </Card>
                  ))
              : mediaUsers.map((user) => (
                  <Card
                    key={user.id}
                    className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-500 transition-all"
                  >
                    <CardContent className="p-0">
                      <div className="p-4 flex items-center gap-4 border-b border-gray-800">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                          <Image src={user.image || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{user.name}</h3>
                          <Badge className="bg-purple-900/30 text-purple-400 border-purple-700">Media</Badge>
                          <p className="text-sm text-gray-400 mt-1">{user.outlet}</p>
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="text-sm text-gray-300 mb-4">{user.bio}</p>

                        <div className="flex gap-2 mb-4">
                          {user.socialLinks.youtube && (
                            <a
                              href={user.socialLinks.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-500 hover:text-red-400"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                              </svg>
                            </a>
                          )}
                          {user.socialLinks.twitter && (
                            <a
                              href={user.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                              </svg>
                            </a>
                          )}
                          {user.socialLinks.instagram && (
                            <a
                              href={user.socialLinks.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-500 hover:text-pink-400"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                  fillRule="evenodd"
                                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </a>
                          )}
                          {user.socialLinks.website && (
                            <a
                              href={user.socialLinks.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-gray-300"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                        </div>

                        <h4 className="font-medium mb-2">Recent Content</h4>
                        <div className="space-y-2">
                          {user.recentContent.slice(0, 1).map((content, idx) => (
                            <a
                              key={idx}
                              href={content.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:bg-gray-800 p-2 rounded-md transition-colors"
                            >
                              <div className="flex gap-3">
                                {content.thumbnail && (
                                  <div className="relative w-16 h-16 flex-shrink-0">
                                    <Image
                                      src={content.thumbnail || "/placeholder.svg"}
                                      alt={content.title}
                                      fill
                                      className="object-cover rounded-md"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium line-clamp-2">{content.title}</p>
                                  <div className="flex items-center text-xs text-gray-400 mt-1">
                                    <Badge variant="outline" className="text-xs mr-2">
                                      {content.type}
                                    </Badge>
                                    <div className="flex items-center">
                                      <ThumbsUp className="w-3 h-3 mr-1" />
                                      {content.likes}
                                    </div>
                                    <span className="mx-2">•</span>
                                    <span>{content.date}</span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </TabsContent>

        <TabsContent value="trending">
          <Card>
            <CardHeader>
              <CardTitle>Trending Media Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading
                  ? Array(5)
                      .fill(0)
                      .map((_, i) => <div key={i} className="h-20 bg-gray-800 animate-pulse rounded-md"></div>)
                  : mediaUsers.flatMap((user) =>
                      user.recentContent.map((content, idx) => (
                        <a
                          key={`${user.id}-${idx}`}
                          href={content.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-purple-500 transition-all"
                        >
                          {content.thumbnail ? (
                            <div className="relative w-20 h-20 flex-shrink-0">
                              <Image
                                src={content.thumbnail || "/placeholder.svg"}
                                alt={content.title}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 bg-gray-800 rounded-md flex items-center justify-center flex-shrink-0">
                              <Video className="w-8 h-8 text-gray-600" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-purple-900/30 text-purple-400 border-purple-700">{user.name}</Badge>
                              <Badge variant="outline" className="text-xs">
                                {content.type}
                              </Badge>
                            </div>
                            <h3 className="font-medium mt-1">{content.title}</h3>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                              <div className="flex items-center">
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                {content.likes}
                              </div>
                              <span className="mx-2">•</span>
                              <span>{content.date}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="flex-shrink-0">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      )),
                    )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

