"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createBattler } from "@/app/actions/battlers"
import { Loader2 } from "lucide-react"

// Form schema with validation
const battlerFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  alias: z.string().optional(),
  bio: z.string().optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
})

type BattlerFormValues = z.infer<typeof battlerFormSchema>

export default function CreateBattlerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Default form values
  const defaultValues: Partial<BattlerFormValues> = {
    name: "",
    alias: "",
    bio: "",
    avatar_url: "",
  }

  // Initialize form
  const form = useForm<BattlerFormValues>({
    resolver: zodResolver(battlerFormSchema),
    defaultValues,
  })

  // Handle form submission
  async function onSubmit(data: BattlerFormValues) {
    setIsSubmitting(true)
    
    try {
      // Call the server action to create battler
      const result = await createBattler({
        name: data.name,
        alias: data.alias || undefined,
        bio: data.bio || undefined,
        avatar_url: data.avatar_url || undefined,
      })
      
      if (!result.success) {
        throw new Error(result.error || "Failed to create battler")
      }
      
      toast({
        title: "Battler created",
        description: `${data.name} has been added to the database.`,
      })
      
      // Redirect to the newly created battler's page
      if (result.data?.id) {
        router.push(`/battlers/${result.data.id}`)
      } else {
        router.push(`/battlers`)
      }
      
      router.refresh()
    } catch (error) {
      console.error("Error creating battler:", error)
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full md:max-w-xl">
      <CardHeader>
        <CardTitle>Create a new battler</CardTitle>
        <CardDescription>Add a battler to the BattleRapRank database.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter battler name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The full name of the battler.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alias (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter alias or nickname" {...field} />
                  </FormControl>
                  <FormDescription>
                    Any known aliases or nicknames for the battler.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a short biography"
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of the battler's background and career.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    A URL link to an image of the battler.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Battler"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
