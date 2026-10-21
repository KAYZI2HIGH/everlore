import { Header } from "@/components/header";
import { MinimalFooter } from "@/components/minimal-footer";
import React from "react";

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pt-24">
      <Header />
      <div className="px-4">{children}</div>
      <MinimalFooter />
    </div>
  );
};

export default BlogLayout;
