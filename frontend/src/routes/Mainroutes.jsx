import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import DashboardLayout from '../components/DashboardLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import AdminRoute from '../components/AdminRoute'
import MemberRoute from '../components/MemberRoute'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import AdminDashboard from '../pages/AdminDashboard'
import MemberDashboard from '../pages/MemberDashboard'
import MembersList from '../pages/MembersList'
import TeamPage from '../pages/TeamPage'
import AddMember from '../pages/AddMember'
import EventsPage from '../pages/EventsPage'
import EventDetails from '../pages/EventDetails'
import AddEventPage from '../pages/AddEventPage'
import ChatPage from '../pages/ChatPage'
import ProfilePage from '../pages/ProfilePage'
import About from '../pages/About'
import Contact from '../pages/Contact'
import NotFound from '../pages/NotFound'

function Mainroutes() {
	const location = useLocation()

	return (
		<AnimatePresence mode="wait">
			<Routes location={location} key={location.pathname}>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				<Route element={<DashboardLayout />}>
					<Route path="/" element={<Home />} />
					<Route path="/events" element={<EventsPage />} />
					<Route path="/events/:id" element={<EventDetails />} />
					<Route path="/team" element={<TeamPage />} />
					<Route path="/about" element={<About />} />
					<Route path="/contact" element={<Contact />} />

					<Route element={<ProtectedRoute />}>
						<Route path="/chat" element={<ChatPage />} />
						<Route path="/profile" element={<ProfilePage />} />
					</Route>

					<Route element={<AdminRoute />}>
						<Route path="/admin-dashboard" element={<AdminDashboard />} />
						<Route path="/members" element={<MembersList />} />
						<Route path="/add-member" element={<AddMember />} />
						<Route path="/add-event" element={<AddEventPage />} />
					</Route>

					<Route element={<MemberRoute />}>
						<Route path="/member-dashboard" element={<MemberDashboard />} />
					</Route>

					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</AnimatePresence>
	)
}

export default Mainroutes
