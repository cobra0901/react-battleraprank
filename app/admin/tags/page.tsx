"use client"
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TagIcon, Filter } from "lucide-react"
import TagManager from "@/components/admin/TagManager"
import { getTags, getTagCategories, type Tag } from "@/lib/tag-service"

export default function TagManagementPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // useEffect(() => {
  //   setTags(getTags())
  //   setCategories(getTagCategories())
  // }, [])

  const filteredTags = selectedCategory === "all" ? tags : tags.filter((tag) => tag.category === selectedCategory)

  const hiddenTags = tags.filter((tag) => tag.isHidden)
  const visibleTags = tags.filter((tag) => !tag.isHidden)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <TagIcon className="w-6 h-6 mr-2 text-blue-500" />
        <h1 className="text-3xl font-bold">Tag Management</h1>
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="all">All Tags</TabsTrigger>
            <TabsTrigger value="visible">Visible Tags</TabsTrigger>
            <TabsTrigger value="hidden">Hidden Tags</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2 text-gray-400" />
              <select
                className="bg-gray-900 border border-gray-700 rounded-md px-3 py-1 text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Tags</CardTitle>
              <CardDescription>Manage all tags in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <TagManager tags={filteredTags} onTagsChange={setTags} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visible">
          <Card>
            <CardHeader>
              <CardTitle>Visible Tags</CardTitle>
              <CardDescription>Tags that are visible to users</CardDescription>
            </CardHeader>
            <CardContent>
              <TagManager
                tags={visibleTags.filter((tag) => selectedCategory === "all" || tag.category === selectedCategory)}
                onTagsChange={setTags}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hidden">
          <Card>
            <CardHeader>
              <CardTitle>Hidden Tags</CardTitle>
              <CardDescription>Tags that are hidden but can be used for filtering</CardDescription>
            </CardHeader>
            <CardContent>
              <TagManager
                tags={hiddenTags.filter((tag) => selectedCategory === "all" || tag.category === selectedCategory)}
                onTagsChange={setTags}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

