export interface Item {
  id: string;
  title: string;
  description: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  updatedAt: string;
}

let items: Item[] = [
  {
    id: "1",
    title: "Launch campaign",
    description: "Plan and execute Q3 product launch campaign",
    status: "active",
    createdAt: new Date("2026-04-10").toISOString(),
    updatedAt: new Date("2026-04-10").toISOString(),
  },
  {
    id: "2",
    title: "Redesign onboarding",
    description: "Improve new user onboarding flow with interactive steps",
    status: "pending",
    createdAt: new Date("2026-04-15").toISOString(),
    updatedAt: new Date("2026-04-18").toISOString(),
  },
  {
    id: "3",
    title: "API documentation",
    description: "Write comprehensive docs for the public REST API",
    status: "inactive",
    createdAt: new Date("2026-04-20").toISOString(),
    updatedAt: new Date("2026-04-22").toISOString(),
  },
];

let nextId = 4;

export function getAll(): Item[] {
  return [...items];
}

export function getById(id: string): Item | undefined {
  return items.find((item) => item.id === id);
}

export function create(data: Omit<Item, "id" | "createdAt" | "updatedAt">): Item {
  const now = new Date().toISOString();
  const newItem: Item = { id: String(nextId++), ...data, createdAt: now, updatedAt: now };
  items.push(newItem);
  return newItem;
}

export function update(id: string, data: Partial<Omit<Item, "id" | "createdAt">>): Item | null {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
  return items[index];
}

export function remove(id: string): boolean {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  return true;
}