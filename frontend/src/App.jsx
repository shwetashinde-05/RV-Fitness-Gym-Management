import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Website Layout & Pages
import PublicLayout from './components/public/PublicLayout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Facilities from './pages/public/Facilities';
import Plans from './pages/public/Plans';
import PublicTrainers from './pages/public/Trainers';
import Gallery from './pages/public/Gallery';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Admin Portal Layout & Pages
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Trainers from './pages/Trainers';
import MembershipPlans from './pages/MembershipPlans';
import AssignMembership from './pages/AssignMembership';
import Payments from './pages/Payments';
import Attendance from './pages/Attendance';
import WorkoutPlans from './pages/WorkoutPlans';
import DietPlans from './pages/DietPlans';
import ProgressTracking from './pages/ProgressTracking';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import UsersManagement from './pages/Users';

// Trainer Portal Layout & Pages
import TrainerLayout from './components/trainer/TrainerLayout';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerMembers from './pages/trainer/TrainerMembers';
import TrainerWorkouts from './pages/trainer/TrainerWorkouts';
import TrainerDiets from './pages/trainer/TrainerDiets';
import TrainerProgress from './pages/trainer/TrainerProgress';
import TrainerProfile from './pages/trainer/TrainerProfile';
import TrainerNotices from './pages/trainer/TrainerNotices';

// Member Portal Layout & Pages
import MemberLayout from './components/member/MemberLayout';
import MemberDashboard from './pages/member/MemberDashboard';
import MemberMembership from './pages/member/MemberMembership';
import MemberPayments from './pages/member/MemberPayments';
import MemberWorkout from './pages/member/MemberWorkout';
import MemberDiet from './pages/member/MemberDiet';
import MemberProgress from './pages/member/MemberProgress';
import MemberAttendance from './pages/member/MemberAttendance';
import MemberProfile from './pages/member/MemberProfile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* =========================================
              1. PUBLIC WEBSITE ROUTES
             ========================================= */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/trainers-public" element={<PublicTrainers />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* =========================================
              2. ADMIN PORTAL (Protected: admin)
             ========================================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="trainers" element={<Trainers />} />
            <Route path="membership-plans" element={<MembershipPlans />} />
            <Route path="assign-membership" element={<AssignMembership />} />
            <Route path="payments" element={<Payments />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="workout-plans" element={<WorkoutPlans />} />
            <Route path="diet-plans" element={<DietPlans />} />
            <Route path="progress" element={<ProgressTracking />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* =========================================
              3. TRAINER PORTAL (Protected: trainer, admin)
             ========================================= */}
          <Route
            path="/trainer"
            element={
              <ProtectedRoute allowedRoles={['trainer', 'admin']}>
                <TrainerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/trainer/dashboard" replace />} />
            <Route path="dashboard" element={<TrainerDashboard />} />
            <Route path="members" element={<TrainerMembers />} />
            <Route path="workouts" element={<TrainerWorkouts />} />
            <Route path="diets" element={<TrainerDiets />} />
            <Route path="progress" element={<TrainerProgress />} />
            <Route path="profile" element={<TrainerProfile />} />
            <Route path="notices" element={<TrainerNotices />} />
          </Route>

          {/* =========================================
              4. MEMBER PORTAL (Protected: member, admin)
             ========================================= */}
          <Route
            path="/member"
            element={
              <ProtectedRoute allowedRoles={['member', 'admin']}>
                <MemberLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/member/dashboard" replace />} />
            <Route path="dashboard" element={<MemberDashboard />} />
            <Route path="membership" element={<MemberMembership />} />
            <Route path="payments" element={<MemberPayments />} />
            <Route path="workout" element={<MemberWorkout />} />
            <Route path="diet" element={<MemberDiet />} />
            <Route path="progress" element={<MemberProgress />} />
            <Route path="attendance" element={<MemberAttendance />} />
            <Route path="profile" element={<MemberProfile />} />
          </Route>

          {/* =========================================
              5. BACKWARD-COMPATIBLE FALLBACKS
             ========================================= */}
          <Route path="/members" element={<Navigate to="/admin/members" replace />} />
          <Route path="/trainers" element={<Navigate to="/admin/trainers" replace />} />
          <Route path="/membership-plans" element={<Navigate to="/admin/membership-plans" replace />} />
          <Route path="/assign-membership" element={<Navigate to="/admin/assign-membership" replace />} />
          <Route path="/payments" element={<Navigate to="/admin/payments" replace />} />
          <Route path="/attendance" element={<Navigate to="/admin/attendance" replace />} />
          <Route path="/workout-plans" element={<Navigate to="/admin/workout-plans" replace />} />
          <Route path="/diet-plans" element={<Navigate to="/admin/diet-plans" replace />} />
          <Route path="/progress" element={<Navigate to="/admin/progress" replace />} />
          <Route path="/notifications" element={<Navigate to="/admin/notifications" replace />} />
          <Route path="/reports" element={<Navigate to="/admin/reports" replace />} />
          <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
