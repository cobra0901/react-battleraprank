import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MockDataManager from "@/components/admin/MockDataManager"
import DataMigrationTool from "@/components/admin/DataMigrationTool"
import { Database, RefreshCw } from "lucide-react"

export default function AdminToolsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Tools</h1>
      <p className="text-gray-400 mb-8">
        These tools are designed for administrators to manage the Alt Battle Rap Algorithm platform. Use these tools to
        generate mock data for testing, migrate data for production, and manage system settings.
      </p>

      <Tabs defaultValue="mock-data" className="space-y-6">
        <TabsList className="bg-gray-900 border border-gray-800">
          <TabsTrigger value="mock-data">
            <RefreshCw className="w-4 h-4 mr-2" />
            Mock Data
          </TabsTrigger>
          <TabsTrigger value="migration">
            <Database className="w-4 h-4 mr-2" />
            Data Migration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mock-data">
          <MockDataManager />
        </TabsContent>

        <TabsContent value="migration">
          <DataMigrationTool />
        </TabsContent>
      </Tabs>
    </div>
  )
}

