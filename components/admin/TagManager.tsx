"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { type Tag, saveTags, addTag, updateTag, deleteTag } from "@/lib/tag-service"
import { toast } from "@/hooks/use-toast"

interface TagManagerProps {
  tags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  }
// Removed misplaced block

export default function TagManager({ tags, onTagsChange }: TagManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTag, setCurrentTag] = useState<Tag | null>(null)
  const [newTag, setNewTag] = useState({
    name: "",
    description: "",
    category: "",
    isHidden: false,
  })

  const handleAddTag = () => {
    if (!newTag.name.trim()) {
      toast({
        title: "Error",
        description: "Tag name is required",
        variant: "destructive",
      })
      return
    }

    addTag(newTag).then((createdTag) => {
      onTagsChange([...tags, createdTag])
      setIsAddDialogOpen(false)
      setNewTag({
        name: "",
        description: "",
        category: "",
        isHidden: false,
      })

      toast({
        title: "Success",
        description: "Tag added successfully",
      })
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive",
      })
    })
    setIsAddDialogOpen(false)
    setNewTag({
      name: "",
      description: "",
      category: "",
      isHidden: false,
    })

    toast({
      title: "Success",
      description: "Tag added successfully",
    })
  }

  const handleEditTag = () => {
    if (!currentTag) return

    updateTag(currentTag.id, {
      name: currentTag.name,
      description: currentTag.description,
      category: currentTag.category,
      isHidden: currentTag.isHidden,
    }).then((updatedTag) => {
      if (updatedTag) {
        const updatedTags = tags.map((tag) => (tag.id === currentTag.id ? updatedTag : tag))
        onTagsChange(updatedTags)
        saveTags(updatedTags)

        toast({
          title: "Success",
          description: "Tag updated successfully",
        })
      }
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to update tag",
        variant: "destructive",
      })
    })

    deleteTag(currentTag.id).then((success) => {
      if (success) {
        const updatedTags = tags.filter((tag) => tag.id !== currentTag.id)
        onTagsChange(updatedTags)

        toast({
          title: "Success",
          description: "Tag deleted successfully",
        })
      }
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive",
      })
    })
  }

  const handleDeleteTag = () => {
    if (!currentTag) return

    deleteTag(currentTag.id).then((success) => {
      if (success) {
        const updatedTags = tags.filter((tag) => tag.id !== currentTag.id)
        onTagsChange(updatedTags)

        toast({
          title: "Success",
          description: "Tag deleted successfully",
        })
      }
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive",
      })
    })

    setIsDeleteDialogOpen(false)
    setCurrentTag(null)
  }

  const openEditDialog = (tag: Tag) => {
    setCurrentTag(tag)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (tag: Tag) => {
    setCurrentTag(tag)
    setIsDeleteDialogOpen(true)
  }

  const toggleTagVisibility = (tag: Tag) => {
      updateTag(tag.id, { isHidden: !tag.isHidden }).then((updatedTag) => {
        if (updatedTag) {
          const updatedTags = tags.map((t) => (t.id === tag.id ? updatedTag : t))
          onTagsChange(updatedTags)
          saveTags(updatedTags)
  
          toast({
            title: "Success",
            description: `Tag is now ${updatedTag.isHidden ? "hidden" : "visible"}`,
          })
        }
      }).catch(() => {
        toast({
          title: "Error",
          description: "Failed to update tag visibility",
          variant: "destructive",
        })
      })
    }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tag
        </Button>
      </div>

      {tags.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg">
          <p className="text-gray-400">No tags found</p>
        </div>
      ) : (
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">{tag.name}</TableCell>
                  <TableCell>{tag.category || "—"}</TableCell>
                  <TableCell className="max-w-xs truncate">{tag.description || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch checked={!tag.isHidden} onCheckedChange={() => toggleTagVisibility(tag)} />
                      <span className="text-sm text-gray-400">{tag.isHidden ? "Hidden" : "Visible"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(tag)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => openDeleteDialog(tag)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Tag Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tag</DialogTitle>
            <DialogDescription>Create a new tag for categorizing battlers</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tag Name</Label>
              <Input
                id="name"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                placeholder="Enter tag name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newTag.category}
                onChange={(e) => setNewTag({ ...newTag, category: e.target.value })}
                placeholder="E.g., Region, League, Style"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={newTag.description}
                onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                placeholder="Describe what this tag represents"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isHidden"
                checked={newTag.isHidden}
                onCheckedChange={(checked) => setNewTag({ ...newTag, isHidden: checked })}
              />
              <Label htmlFor="isHidden">Hidden Tag</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTag}>Add Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>Update tag information</DialogDescription>
          </DialogHeader>

          {currentTag && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Tag Name</Label>
                <Input
                  id="edit-name"
                  value={currentTag.name}
                  onChange={(e) => setCurrentTag({ ...currentTag, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={currentTag.category || ""}
                  onChange={(e) => setCurrentTag({ ...currentTag, category: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={currentTag.description || ""}
                  onChange={(e) => setCurrentTag({ ...currentTag, description: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isHidden"
                  checked={currentTag.isHidden}
                  onCheckedChange={(checked) => setCurrentTag({ ...currentTag, isHidden: checked })}
                />
                <Label htmlFor="edit-isHidden">Hidden Tag</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTag}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Tag Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the tag "{currentTag?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTag}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

