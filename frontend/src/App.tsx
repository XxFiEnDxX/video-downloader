import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import HowTo from './components/HowTo'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import './styles/App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowTo />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

export default App
