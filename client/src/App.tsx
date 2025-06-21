import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { Home } from './pages/Home'
import { Orders }from './pages/Orders'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
      <Toaster />
    </Layout>
  )
}

export default App 