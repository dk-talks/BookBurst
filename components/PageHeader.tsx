// components/PageHeader.tsx
"use client";

export default function PageHeader({ title, children }: { title: string, children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <h1 className="text-3xl font-bold mb-4 md:mb-0">{title}</h1>
      <div>{children}</div>
    </div>
  );
}