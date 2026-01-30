import { Header } from "@/components/header";
import { MinimalFooter } from "@/components/minimal-footer";
import React from "react";

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div className="px-4">{children}</div>
      <MinimalFooter />
    </>
  );
};

export default BlogLayout;
