import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import React from "react";

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SiteHeader />
      <main className="container-page py-12">{children}</main>
      <SiteFooter />
    </>
  );
};

export default BlogLayout;
