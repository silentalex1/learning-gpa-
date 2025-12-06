import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import ClassPage from './ClassPage'

const classes = [
  { id: 'history', name: 'History' },
  { id: 'biology', name: 'Biology' },
  { id: 'algebra', name: 'Algebra' },
  { id: 'english', name: 'English' },
  { id: 'science', name: 'Science' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'physics', name: 'Physics' },
  { id: 'calculus', name: 'Calculus' },
]

const backgrounds = [
  'url("/images/learningkids.png")',
  'url("/images/learningbackground.png")',
  'url("/images/background2.png")'
]

function App() {
  const [currentBg, setCurrentBg] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % backgrounds.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-1000" style={{ backgroundImage: backgrounds[currentBg] }}>
        <div className="min-h-screen bg-black/60">
          <Navbar onOpenModal={() => setIsModalOpen(true)} />
          <Routes>
            <Route path="/" element={<Home onOpenModal={() => setIsModalOpen(true)} />} />
            {classes.map(cls => (
              <Route key={cls.id} path={`/${cls.id}gpa`} element={<ClassPage className={cls.name} />} />
            ))}
          </Routes>
          <ClassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} classes={classes} />
        </div>
      </div>
    </Router>
  )
}

function Navbar({ onOpenModal }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed w-full z-50 transition-all ${scrolled ? 'bg-black/90 py-3' : 'bg-black/50 py-5'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">LearningGPA</Link>
        <button onClick={onOpenModal} className="px-4 py-2 text-white hover:text-emerald-400 transition-colors">
          Classes
        </button>
      </div>
    </nav>
  )
}

function Home({ onOpenModal }) {
  return (
    <div className="pt-24 pb-16">
      <section className="min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Work more efficient. More Faster.</h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Start by getting your grades up solving problems with LearningGPA.
          </p>
          <button 
            onClick={onOpenModal}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-full text-lg transition-all hover:scale-105"
          >
            Get Started →
          </button>
        </div>
      </section>

      <section className="py-20 bg-black/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-8">How can LearningGPA Help You?</h2>
          <p className="text-lg text-gray-200 text-center max-w-3xl mx-auto">
            We offer various tools for you to use with your classes. Using these tools on our site can help you solve questions step by step and bring your grades up like a pro.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Ready to work more efficient with your class lessons online?</h2>
          <button 
            onClick={onOpenModal}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-full text-lg transition-all hover:scale-105"
          >
            Try LearningGPA Now
          </button>
        </div>
      </section>

      <footer className="bg-black/70 py-12">
        <div className="container mx-auto px-4">
          <img 
            src="/images/learningschedule.png" 
            alt="Learning Schedule" 
            className="mx-auto rounded-lg shadow-xl max-w-4xl w-full"
          />
        </div>
      </footer>
    </div>
  )
}

function ClassModal({ isOpen, onClose, classes }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Select Your Class</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">
              &times;
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {classes.map(cls => (
              <Link
                key={cls.id}
                to={`/${cls.id}gpa`}
                className="bg-gray-800 hover:bg-emerald-600/20 border border-gray-700 hover:border-emerald-500 rounded-lg p-6 text-center transition-all hover:scale-105"
                onClick={onClose}
              >
                <div className="text-xl font-medium text-white">{cls.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App