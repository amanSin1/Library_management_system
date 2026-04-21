import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AdminHome from './pages/AdminHome'
import UserHome from './pages/UserHome'
import Navbar from './components/Navbar'
import BookAvailability from './pages/transactions/BookAvailability'
import IssueBook from './pages/transactions/IssueBook'
import ReturnBook from './pages/transactions/ReturnBook'
import PayFine from './pages/transactions/PayFine'
import Reports from './pages/reports/Reports'
import BooksList from './pages/reports/BooksList'
import MoviesList from './pages/reports/MoviesList'
import MembershipsList from './pages/reports/MembershipsList'
import ActiveIssues from './pages/reports/ActiveIssues'
import OverdueReturns from './pages/reports/OverdueReturns'
import IssueRequests from './pages/reports/IssueRequests'
import Maintenance from './pages/maintenance/Maintenance'
import AddMembership from './pages/maintenance/AddMembership'
import UpdateMembership from './pages/maintenance/UpdateMembership'
import AddBook from './pages/maintenance/AddBook'
import UpdateBook from './pages/maintenance/UpdateBook'
import UserManagement from './pages/maintenance/UserManagement'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (!user.isAdmin) return <Navigate to="/home" />
  return children
}

export default function App() {
  const { user } = useAuth()

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<PrivateRoute><UserHome /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminHome /></AdminRoute>} />

        {/* Transactions */}
        <Route path="/transactions/availability" element={<PrivateRoute><BookAvailability /></PrivateRoute>} />
        <Route path="/transactions/issue" element={<PrivateRoute><IssueBook /></PrivateRoute>} />
        <Route path="/transactions/return" element={<PrivateRoute><ReturnBook /></PrivateRoute>} />
        <Route path="/transactions/pay-fine" element={<PrivateRoute><PayFine /></PrivateRoute>} />

        {/* Reports */}
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/reports/books" element={<PrivateRoute><BooksList /></PrivateRoute>} />
        <Route path="/reports/movies" element={<PrivateRoute><MoviesList /></PrivateRoute>} />
        <Route path="/reports/memberships" element={<PrivateRoute><MembershipsList /></PrivateRoute>} />
        <Route path="/reports/active-issues" element={<PrivateRoute><ActiveIssues /></PrivateRoute>} />
        <Route path="/reports/overdue" element={<PrivateRoute><OverdueReturns /></PrivateRoute>} />
        <Route path="/reports/issue-requests" element={<PrivateRoute><IssueRequests /></PrivateRoute>} />

        {/* Maintenance - Admin only */}
        <Route path="/maintenance" element={<AdminRoute><Maintenance /></AdminRoute>} />
        <Route path="/maintenance/membership/add" element={<AdminRoute><AddMembership /></AdminRoute>} />
        <Route path="/maintenance/membership/update" element={<AdminRoute><UpdateMembership /></AdminRoute>} />
        <Route path="/maintenance/item/add" element={<AdminRoute><AddBook /></AdminRoute>} />
        <Route path="/maintenance/item/update" element={<AdminRoute><UpdateBook /></AdminRoute>} />
        <Route path="/maintenance/users" element={<AdminRoute><UserManagement /></AdminRoute>} />

        <Route path="*" element={<Navigate to={user ? (user.isAdmin ? '/admin' : '/home') : '/login'} />} />
      </Routes>
    </>
  )
}