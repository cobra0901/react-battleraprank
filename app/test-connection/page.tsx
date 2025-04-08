import SupabaseConnectionTest from "@/components/SupabaseConnectionTest"

export default function TestConnectionPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Supabase Connection Test</h1>
      <SupabaseConnectionTest />
    </div>
  )
}

