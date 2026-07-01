import { tasks } from "./_components/data";
import { Tasks } from "./_components/tasks";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl tracking-tight">Gestion des tâches</h2>
        <p className="text-muted-foreground">Liste complète des tâches de l'équipe Zoldick</p>
      </div>
      <Tasks data={tasks} />
    </div>
  );
}
