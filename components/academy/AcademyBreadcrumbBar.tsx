import { BreadcrumbUI, type BreadcrumbItem } from "@/components/BreadcrumbUi";

interface AcademyBreadcrumbBarProps {
  items: BreadcrumbItem[];
}

export function AcademyBreadcrumbBar({
  items,
}: AcademyBreadcrumbBarProps) {
  return (
    <div className="border-b border-border">
      <BreadcrumbUI
        className="mx-auto max-w-6xl px-6 py-4"
        items={items}
      />
    </div>
  );
}
