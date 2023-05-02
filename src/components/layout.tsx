import type { PropsWithChildren } from 'react'

const PageLayout = (props: PropsWithChildren<unknown>) => {
  return (
    <main className="flex justify-center min-h-screen">
      <div className="self-stretch w-full border-x border-slate-400 md:max-w-2xl">
        <div className="h-full border-b border-slate-400">
          {props.children}
        </div>
      </div>
    </main>
  )
}

export default PageLayout
