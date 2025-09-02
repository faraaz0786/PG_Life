import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import ListingDetail from './pages/ListingDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import SeekerDashboard from './pages/SeekerDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import NotFound from './pages/NotFound'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Protected from './components/Protected'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/seeker" element={<Protected role="seeker"><SeekerDashboard /></Protected>} />
          <Route path="/owner" element={<Protected role="owner"><OwnerDashboard /></Protected>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
