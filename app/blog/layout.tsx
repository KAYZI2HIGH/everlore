import { Header } from '@/components/header'
import { MinimalFooter } from '@/components/minimal-footer'
import React from 'react'

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header/>
      {children}
      <MinimalFooter/>
    </>
  )
}

export default BlogLayout