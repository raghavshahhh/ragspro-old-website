import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Spline = dynamic(() => import('@splinetool/react-spline').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      <div className="animate-pulse text-accent">Loading 3D Model...</div>
    </div>
  ),
})

export default function SplineModel() {
  return (
    <Suspense fallback={
      <div className="w-full h-full min-h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-accent">Loading 3D Model...</div>
      </div>
    }>
      <Spline scene="https://prod.spline.design/23srEjEfgbBjQIle/scene.splinecode" />
    </Suspense>
  )
}