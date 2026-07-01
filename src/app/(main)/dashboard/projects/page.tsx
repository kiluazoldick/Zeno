import { ProjectKpi } from "./_components/project-kpi";
import { ProjectList } from "./_components/project-list";
import { ProjectProgress } from "./_components/project-progress";
import { ProjectStatusChart } from "./_components/project-status-chart";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="space-y-1">
        <h2 className="text-3xl tracking-tight">Projets</h2>
        <p className="text-muted-foreground text-sm">Gérez l'ensemble des projets de Zoldick Entreprise</p>
      </div>
      <ProjectKpi />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ProjectProgress />
        </div>
        <div className="xl:col-span-5">
          <ProjectStatusChart />
        </div>
      </div>
      <ProjectList />
    </div>
  );
}
