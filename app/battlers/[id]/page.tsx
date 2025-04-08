import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"
import AttributesTab from "@/components/battler/AttributesTab"
import AnalyticsTab from "@/components/battler/AnalyticsTab"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import ClientBattlerDetails from "@/components/battler/ClientBattlerDetails"

// Type for battler data
interface Battler {
  id: string
  name: string
  alias?: string
  bio?: string
  avatar_url?: string
  social_links?: any
  stats?: any
  created_at?: string
  updated_at?: string
}

// Fetch battler data directly in server component
async function getBattler(id: string): Promise<Battler | null> {
  try {
    const { data, error } = await supabase
      .from("battlers")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching battler:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception fetching battler:", error);
    return null;
  }
}

export default async function BattlerPage({ params }: { params: { id: string } }) {
  const battler = await getBattler(params.id);
  
  if (!battler) {
    return (
      <div className="container py-8 mx-auto text-center">
        <h1 className="text-3xl font-bold text-red-500">Error</h1>
        <p className="mt-4 text-gray-400">Battler not found or there was an error loading the data.</p>
        <div className="mt-6">
          <Link href="/battlers" className="text-primary hover:underline">
            Return to all battlers
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* Banner Image */}
      <div className="w-full h-[200px] relative">
        <Image
          src="/placeholder.svg?height=200&width=1200"
          alt="Banner"
          fill
          className="object-cover"
        />
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background shadow-xl">
            <Image
              src={battler.avatar_url || "/placeholder.svg?height=400&width=400"}
              alt={battler.name}
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{battler.name}</h1>
            {battler.alias && (
              <div className="flex items-center mt-1 text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{battler.alias}</span>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {battler.stats && Object.keys(battler.stats).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              {(!battler.stats || Object.keys(battler.stats).length === 0) && (
                <Badge variant="outline">No Stats Available</Badge>
              )}
            </div>

            {/* Overall Rating */}
            <div className="mt-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Overall Rating</h3>
                  <div className="text-2xl font-bold">
                    {battler.stats?.rating || "No Rating"}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Wins</div>
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {battler.stats?.wins || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Losses</div>
                    <div className="flex items-center text-red-500">
                      <XCircle className="w-4 h-4 mr-1" />
                      {battler.stats?.losses || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Send battler data to client-side tabs */}
        <ClientBattlerDetails battler={battler} />
      </div>
    </div>
  );
}
