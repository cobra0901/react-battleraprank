export const dynamic = "force-dynamic";
import { getBattlerById } from "@/lib/data-service"
import BattlerForm from "@/components/admin/BattlerForm"

export default async function EditBattlerPage({ params }: { params: { id: string } }) {
  const battler = await getBattlerById(params.id)

  if (!battler) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Battler Not Found</h1>
        <p>The battler you are looking for does not exist.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Battler</h1>
      <BattlerForm battler={battler} />
    </div>
  )
}

