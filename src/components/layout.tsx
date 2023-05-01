import type { PropsWithChildren } from 'react'

const PageLayout = (props: PropsWithChildren<unknown>) => {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
        <div className="flex border-b border-slate-400">
          {props.children}
        </div>
      </div>
    </main>
  )
}

export default PageLayout
