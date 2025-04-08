export const dynamic = "force-dynamic";
import BattlerForm from "@/components/admin/BattlerForm"

export default function NewBattlerPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add New Battler</h1>
      <BattlerForm />
    </div>
  )
}

