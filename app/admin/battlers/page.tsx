export const dynamic = "force-dynamic";
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getBattlers } from "@/lib/data-service"
import { Plus, Pencil } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DeleteBattlerButton from "@/components/admin/DeleteBattlerButton"

export default async function BattlersPage() {
  const battlers = await getBattlers()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Battlers</h1>
        <Button asChild>
          <Link href="/admin/battlers/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Battler
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Battlers</CardTitle>
          <CardDescription>Manage all battlers in the database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4">Image</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-left py-3 px-4">Rating</th>
                  <th className="text-left py-3 px-4">Tags</th>
                  <th className="text-left py-3 px-4">Added</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {battlers.map((battler) => (
                  <tr key={battler.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 relative rounded-full overflow-hidden">
                        <Image
                          src={battler.image || "/placeholder.svg"}
                          alt={battler.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{battler.name}</td>
                    <td className="py-3 px-4 text-gray-400">{battler.location}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-gray-800 rounded-full text-sm">
                        {battler.totalPoints.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {battler.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{new Date(battler.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/battlers/${battler.id}`}>
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </Button>
                        <DeleteBattlerButton id={battler.id} name={battler.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

