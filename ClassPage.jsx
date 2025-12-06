import { useParams } from 'react-router-dom'

export default function ClassPage() {
  const { className } = useParams()
  
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">{className}</h1>
        <div className="bg-gray-800/80 rounded-xl p-8">
          <p className="text-gray-200">Content for {className} will be displayed here.</p>
        </div>
      </div>
    </div>
  )
}