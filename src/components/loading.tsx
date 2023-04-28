import LoadingSpinner from "./loading-spinner";

export default function Loading() {
  return (
    <div className="absolute top-0 left-0 flex h-screen w-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}
