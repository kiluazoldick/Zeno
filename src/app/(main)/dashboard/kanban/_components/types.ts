export type ColumnId = "todo" | "in-progress" | "cancelled" | "done";

export type Column = {
  id: ColumnId;
  title: string;
};

export type TaskTeam = "Terrain" | "Bureau" | "Finance" | "Commercial" | "Direction" | "Rapport" | "Admin";

export type TaskPriority = "Haute" | "Moyenne" | "Basse";

export type TaskInsightLabel = "Attachments" | "Comments" | "Documents";

export type TaskInsight = {
  label: TaskInsightLabel;
  count: number;
};

export type TaskOwnerProfile = {
  name: string;
  tone: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  location?: string;
  reportDone: boolean;
  progress: number;
  owner: TaskOwnerProfile;
  team: TaskTeam;
  insights: TaskInsight[];
};

export type BoardState = Record<ColumnId, Task[]>;
