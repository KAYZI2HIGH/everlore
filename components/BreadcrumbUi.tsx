import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbUIProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbUI({ items, className }: BreadcrumbUIProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div
              key={`${item.label}-${index}`}
              className="flex items-center"
            >
              <BreadcrumbItem>
                {isLast ?
                  <BreadcrumbPage className="text-foreground font-medium">
                    {item.label}
                  </BreadcrumbPage>
                : <BreadcrumbLink asChild>
                    <Link
                      href={item.href || "#"}
                      className="hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                }
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="mx-2" />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
