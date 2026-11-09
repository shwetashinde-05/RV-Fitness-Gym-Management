const express = require('express');
const router = express.Router();
const { pool, isPgConnected, getStore, saveStore } = require('../config/db');

// In-memory active tokens map for sessions
const activeSessions = new Map();

// Helper to generate a token
function generateToken(user) {
  const token = `rvf_token_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  activeSessions.set(token, {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    related_id: user.related_id,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });
  return token;
}

// Authentication Middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : req.headers['x-auth-token'] || req.query.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }

  const session = activeSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    // Check if token matches standard demo format for testing
    if (token.startsWith('rvf_token_')) {
      const parts = token.split('_');
      const userId = parseInt(parts[2], 10);
      const store = getStore();
      const user = store.users.find(u => u.id === userId);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          related_id: user.related_id
        };
        return next();
      }
    }
    return res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
  }

  req.user = session;
  next();
}

// Role Authorization Middleware
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}] roles. Your role is ${req.user.role}.`
      });
    }
    next();
  };
}

// Helper to auto-generate Next Member ID: RVF-0001, RVF-0002...
function generateNextMemberId(existingMembers) {
  let maxNum = 0;
  for (const m of existingMembers) {
    if (m.member_id && m.member_id.startsWith('RVF-')) {
      const numPart = parseInt(m.member_id.replace('RVF-', ''), 10);
      if (!isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    }
  }
  const nextNum = maxNum + 1;
  return `RVF-${String(nextNum).padStart(4, '0')}`;
}

// Helper to auto-generate Next Trainer ID: TR-001...
function generateNextTrainerId(existingTrainers) {
  let maxNum = 0;
  for (const t of existingTrainers) {
    if (t.trainer_id && t.trainer_id.startsWith('TR-')) {
      const numPart = parseInt(t.trainer_id.replace('TR-', ''), 10);
      if (!isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    }
  }
  return `TR-${String(maxNum + 1).padStart(3, '0')}`;
}

// Helper to auto-generate Next Invoice ID: INV-2026-0001...
function generateNextInvoiceId(existingPayments) {
  const year = new Date().getFullYear();
  let maxNum = 0;
  for (const p of existingPayments) {
    if (p.payment_id && p.payment_id.startsWith(`INV-${year}-`)) {
      const numPart = parseInt(p.payment_id.replace(`INV-${year}-`, ''), 10);
      if (!isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    }
  }
  return `INV-${year}-${String(maxNum + 1).padStart(4, '0')}`;
}

// ==========================================
// 1. AUTHENTICATION APIs
// ==========================================
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const store = getStore();
    const user = store.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        related_id: user.related_id,
        phone: user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, gender, address } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, phone, and password are required.' });
    }

    const store = getStore();
    const existing = store.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Auto create member record
    const member_id = generateNextMemberId(store.members);
    const newMember = {
      id: Date.now(),
      member_id,
      full_name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      date_of_birth: '',
      gender: gender || 'Male',
      address: address ? address.trim() : 'Narsobawadi, Maharashtra',
      emergency_contact: '',
      registration_date: new Date().toISOString().split('T')[0],
      status: 'Active',
      assigned_trainer_id: store.trainers.length > 0 ? store.trainers[0].trainer_id : null,
      created_at: new Date().toISOString()
    };
    store.members.push(newMember);

    // Create user account with 'member' role
    const newUser = {
      id: Date.now() + 1,
      email: email.trim().toLowerCase(),
      password: password,
      name: name.trim(),
      role: 'member',
      related_id: member_id,
      phone: phone.trim(),
      status: 'Active',
      created_at: new Date().toISOString()
    };
    store.users.push(newUser);

    // Save notification for admin
    store.notifications.unshift({
      id: Date.now() + 2,
      title: 'New Member Online Registration',
      message: `${name} registered online (${member_id}).`,
      type: 'member',
      target_role: 'admin',
      target_id: null,
      read_status: false,
      created_at: new Date().toISOString()
    });

    saveStore(store);

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to RV FITNESS.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        related_id: newUser.related_id,
        phone: newUser.phone
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/auth/me', authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

router.post('/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    activeSessions.delete(authHeader.slice(7));
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ==========================================
// 2. USERS MANAGEMENT (Admin only)
// ==========================================
router.get('/users', authenticate, authorizeRoles('admin'), (req, res) => {
  try {
    const store = getStore();
    const safeUsers = store.users.map(({ password, ...u }) => u);
    res.json({ success: true, data: safeUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/users', authenticate, authorizeRoles('admin'), (req, res) => {
  try {
    const { name, email, password, role, related_id, phone } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, password and role are required.' });
    }
    const store = getStore();
    const existing = store.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists.' });
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      related_id: related_id || null,
      phone: phone || '',
      status: 'Active',
      created_at: new Date().toISOString()
    };
    store.users.push(newUser);
    saveStore(store);

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ success: true, data: safeUser, message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 3. TRAINER PORTAL APIs (Backend Protected)
// ==========================================
router.get('/trainer/dashboard', authenticate, authorizeRoles('trainer', 'admin'), (req, res) => {
  try {
    const store = getStore();
    const trainerId = req.user.related_id;
    const trainer = trainerId ? store.trainers.find(t => t.trainer_id === trainerId) : null;

    // ONLY assigned members
    const assignedMembers = trainerId ? store.members.filter(m => m.assigned_trainer_id === trainerId) : [];
    const assignedMemberIds = assignedMembers.map(m => m.member_id);

    // Workouts created by or assigned to this trainer
    const workouts = trainerId ? store.workout_plans.filter(w => w.trainer_id === trainerId || assignedMemberIds.includes(w.member_id)) : [];

    // Today's attendance for assigned members
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = store.attendance.filter(a => assignedMemberIds.includes(a.member_id) && a.date === today);

    // Notices for trainer
    const notices = store.notifications.filter(n => n.target_role === 'all' || n.target_role === 'trainer');

    res.json({
      success: true,
      data: {
        trainer,
        stats: {
          assignedMembersCount: assignedMembers.length,
          activeWorkoutsCount: workouts.length,
          todayPresentCount: todayAttendance.length,
          totalAssignedActive: assignedMembers.filter(m => m.status === 'Active').length
        },
        assignedMembers,
        workouts: workouts.slice(0, 5),
        todayAttendance,
        notices
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Trainer Assigned Members list (Enforced backend check)
router.get('/trainer/members', authenticate, authorizeRoles('trainer', 'admin'), (req, res) => {
  try {
    const store = getStore();
    const trainerId = req.user.role === 'admin' ? (req.query.trainer_id || null) : req.user.related_id;
    const members = trainerId ? store.members.filter(m => m.assigned_trainer_id === trainerId) : (req.user.role === 'admin' ? store.members : []);
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Trainer Single Member Details (Backend permission verified)
router.get('/trainer/members/:memberId', authenticate, authorizeRoles('trainer', 'admin'), (req, res) => {
  try {
    const { memberId } = req.params;
    const store = getStore();
    const trainerId = req.user.role === 'admin' ? null : req.user.related_id;

    const member = store.members.find(m => m.member_id === memberId || String(m.id) === memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    // Backend Permission Enforcement: If trainer, check assignment!
    if (trainerId && member.assigned_trainer_id !== trainerId) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Member ${member.member_id} is not assigned to you (Coach ${trainerId}).`
      });
    }

    const memberships = store.member_memberships.filter(mm => mm.member_id === member.member_id);
    const workouts = store.workout_plans.filter(w => w.member_id === member.member_id);
    const diets = store.diet_plans.filter(d => d.member_id === member.member_id);
    const progress = store.progress_records.filter(pr => pr.member_id === member.member_id);
    const attendance = store.attendance.filter(a => a.member_id === member.member_id);

    res.json({
      success: true,
      data: {
        ...member,
        memberships,
        workouts,
        diets,
        progress,
        attendance
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Trainer Profile API
router.get('/trainer/profile', authenticate, authorizeRoles('trainer', 'admin'), (req, res) => {
  try {
    const store = getStore();
    const trainerId = req.user.related_id;
    if (!trainerId) {
      return res.status(404).json({ success: false, message: 'Trainer profile not found.' });
    }
    const trainer = store.trainers.find(t => t.trainer_id === trainerId);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer profile not found.' });
    }
    res.json({ success: true, data: trainer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/trainer/profile', authenticate, authorizeRoles('trainer', 'admin'), (req, res) => {
  try {
    const store = getStore();
    const trainerId = req.user.related_id;
    if (!trainerId) {
      return res.status(404).json({ success: false, message: 'Trainer not found.' });
    }
    const idx = store.trainers.findIndex(t => t.trainer_id === trainerId);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Trainer not found.' });
    }
    const { phone, email, specialization, experience, bio } = req.body;
    store.trainers[idx] = {
      ...store.trainers[idx],
      phone: phone || store.trainers[idx].phone,
      email: email || store.trainers[idx].email,
      specialization: specialization || store.trainers[idx].specialization,
      experience: experience || store.trainers[idx].experience,
      bio: bio !== undefined ? bio : store.trainers[idx].bio
    };
    saveStore(store);
    res.json({ success: true, data: store.trainers[idx], message: 'Trainer profile updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 4. MEMBER PORTAL APIs (Backend Protected)
// ==========================================
router.get('/member/dashboard', authenticate, authorizeRoles('member', 'admin'), (req, res) => {
  try {
    const store = getStore();
    const memberId = req.user.related_id;
    if (!memberId) {
      return res.status(404).json({ success: false, message: 'Member profile not found.' });
    }
    const member = store.members.find(m => m.member_id === memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member profile not found.' });
    }

    // Active Membership details
    const memberships = store.member_memberships.filter(mm => mm.member_id === memberId);
    const activeMembership = memberships.find(mm => mm.status === 'Active') || memberships[0] || null;
    let plan = null;
    let daysRemaining = 0;
    if (activeMembership) {
      plan = store.membership_plans.find(p => p.id === activeMembership.plan_id);
      const end = new Date(activeMembership.end_date);
      const now = new Date();
      const diffTime = end - now;
      daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    // Assigned Trainer
    const trainer = member.assigned_trainer_id ? store.trainers.find(t => t.trainer_id === member.assigned_trainer_id) : null;

    // Workouts & Diets
    const workouts = store.workout_plans.filter(w => w.member_id === memberId);
    const diets = store.diet_plans.filter(d => d.member_id === memberId);

    // Latest Progress
    const progress = store.progress_records
      .filter(pr => pr.member_id === memberId)
      .sort((a, b) => new Date(b.record_date) - new Date(a.record_date));

    // Recent Attendance (Days attended this month)
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyAttendance = store.attendance.filter(a => a.member_id === memberId && a.date.startsWith(currentMonth));

    // Notices
    const notices = store.notifications.filter(n => n.target_role === 'all' || n.target_role === 'member');

    res.json({
      success: true,
      data: {
        member,
        activeMembership: activeMembership ? { ...activeMembership, plan_name: plan ? plan.name : 'Gym Plan', daysRemaining } : null,
        trainer: trainer ? { trainer_id: trainer.trainer_id, full_name: trainer.full_name, phone: trainer.phone, specialization: trainer.specialization } : null,
        workout: workouts[0] || null,
        diet: diets[0] || null,
        latestProgress: progress[0] || null,
        monthlyAttendanceCount: monthlyAttendance.length,
        notices
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Member Profile
router.get('/member/profile', authenticate, authorizeRoles('member', 'admin'), (req, res) => {
  try {
    const store = getStore();
    const memberId = req.user.related_id;
    if (!memberId) return res.status(404).json({ success: false, message: 'Member not found' });
    const member = store.members.find(m => m.member_id === memberId);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/member/profile', authenticate, authorizeRoles('member', 'admin'), (req, res) => {
  try {
    const store = getStore();
    const memberId = req.user.related_id;
    if (!memberId) return res.status(404).json({ success: false, message: 'Member not found' });
    const idx = store.members.findIndex(m => m.member_id === memberId);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Member not found' });

    const { phone, address, emergency_contact } = req.body;
    store.members[idx] = {
      ...store.members[idx],
      phone: phone || store.members[idx].phone,
      address: address !== undefined ? address : store.members[idx].address,
      emergency_contact: emergency_contact !== undefined ? emergency_contact : store.members[idx].emergency_contact
    };
    saveStore(store);
    res.json({ success: true, data: store.members[idx], message: 'Profile updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Member Subscriptions
router.get('/member/membership', authenticate, authorizeRoles('member', 'admin'), (req, res) => {
  try {
    const store = getStore();
    const memberId = req.user.related_id;
    if (!memberId) return res.json({ success: true, data: [] });
    const memberships = store.member_memberships
      .filter(mm => mm.member_id === memberId)
      .map(mm => {
        const plan = store.membership_plans.find(p => p.id === mm.plan_id);
        return { ...mm, plan_name: plan ? plan.name : 'Gym Plan', plan_price: plan ? plan.price : mm.amount };
      });
    res.json({ success: true, data: memberships });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Member Payments & Invoices (Protected: only their own invoices)
router.get('/member/payments', authenticate, authorizeRoles('member', 'admin'), (req, res) => {
  try {
    const store = getStore();
    const memberId = req.user.related_id;
    if (!memberId) return res.json({ success: true, data: [] });
    const payments = store.payments.filter(p => p.member_id === memberId);
    res.json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Member Workout
router.get('/member/workout', authenticate, authorizeRoles('member', 'admin'), (req, res) => {
  try {
    const store = getStore();
    const memberId = req.user.related_id;
    if (!memberId) return res.json({ success: true, data: [] });
    const plans = store.workout_plans.filter(w => w.member_id === memberId);
    res.json({ success: true, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Member Diet
router.get('/member/diet', authenticate, authorizeRoles('member', 'admin'), (req, res) => {
  try {
    const store = getStore();
    const memberId = req.user.related_id;
    if (!memberId) return res.json({ success: true, data: [] });
    const diets = store.diet_plans.filter(d => d.member_id === memberId);
    res.json({ success: true, data: diets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Member Progress
router.get('/member/progress', authenticate, authorizeRoles('member', 'admin'), (req, res) => {
  try {
    const store = getStore();
    const memberId = req.user.related_id;
    if (!memberId) return res.json({ success: true, data: [] });
    const progress = store.progress_records
      .filter(pr => pr.member_id === memberId)
      .sort((a, b) => new Date(b.record_date) - new Date(a.record_date));
    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/member/progress', authenticate, authorizeRoles('member', 'admin'), (req, res) => {
  try {
    const store = getStore();
    const memberId = req.user.related_id;
    if (!memberId) return res.status(400).json({ success: false, message: 'Member not found.' });
    const { weight, height, chest, waist, arms, fitness_notes } = req.body;
    if (!weight) return res.status(400).json({ success: false, message: 'Weight is required.' });

    const newRecord = {
      id: Date.now(),
      member_id: memberId,
      record_date: new Date().toISOString().split('T')[0],
      weight: parseFloat(weight),
      height: height ? parseFloat(height) : null,
      chest: chest ? parseFloat(chest) : null,
      waist: waist ? parseFloat(waist) : null,
      arms: arms ? parseFloat(arms) : null,
      fitness_notes: fitness_notes || 'Self logged check-in',
      created_at: new Date().toISOString()
    };
    store.progress_records.unshift(newRecord);
    saveStore(store);
    res.status(201).json({ success: true, data: newRecord, message: 'Progress recorded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Member Attendance
router.get('/member/attendance', authenticate, authorizeRoles('member', 'admin'), (req, res) => {
  try {
    const store = getStore();
    const memberId = req.user.related_id;
    if (!memberId) return res.json({ success: true, data: [] });
    const attendance = store.attendance
      .filter(a => a.member_id === memberId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json({ success: true, data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 5. PUBLIC & SHARED APIS (Website)
// ==========================================
router.get('/public/plans', (req, res) => {
  try {
    const store = getStore();
    const activePlans = store.membership_plans.filter(p => p.status === 'Active');
    res.json({ success: true, data: activePlans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/public/trainers', (req, res) => {
  try {
    const store = getStore();
    const activeTrainers = store.trainers.filter(t => t.status === 'Active');
    res.json({ success: true, data: activeTrainers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/public/gym-info', (req, res) => {
  try {
    const store = getStore();
    res.json({ success: true, data: store.gym_settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 6. ADMIN PORTAL CORE APIS (Preserved)
// ==========================================
router.get('/members', async (req, res) => {
  try {
    const { search, status } = req.query;
    const store = getStore();
    let members = [...store.members];
    if (status && status !== 'All') {
      members = members.filter(m => m.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      members = members.filter(m =>
        m.full_name.toLowerCase().includes(q) ||
        m.member_id.toLowerCase().includes(q) ||
        (m.phone && m.phone.toLowerCase().includes(q))
      );
    }
    members.sort((a, b) => b.id - a.id);
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const store = getStore();
    const member = store.members.find(m => String(m.id) === id || m.member_id === id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const memberships = store.member_memberships
      .filter(mm => mm.member_id === member.member_id)
      .map(mm => {
        const plan = store.membership_plans.find(p => p.id === mm.plan_id);
        return { ...mm, plan_name: plan ? plan.name : 'Custom Plan' };
      });

    const payments = store.payments.filter(p => p.member_id === member.member_id);
    const attendance = store.attendance.filter(a => a.member_id === member.member_id);
    const workoutPlans = store.workout_plans.filter(w => w.member_id === member.member_id);
    const dietPlans = store.diet_plans.filter(d => d.member_id === member.member_id);
    const progress = store.progress_records.filter(pr => pr.member_id === member.member_id);

    res.json({
      success: true,
      data: {
        ...member,
        memberships,
        payments,
        attendance,
        workoutPlans,
        dietPlans,
        progress
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/members', async (req, res) => {
  try {
    const { full_name, email, phone, date_of_birth, gender, address, emergency_contact, assigned_trainer_id } = req.body;
    if (!full_name || !phone) {
      return res.status(400).json({ success: false, message: 'Full name and phone are required.' });
    }

    const store = getStore();
    const member_id = generateNextMemberId(store.members);
    const newMember = {
      id: Date.now(),
      member_id,
      full_name: full_name.trim(),
      email: email ? email.trim() : '',
      phone: phone.trim(),
      date_of_birth: date_of_birth || '',
      gender: gender || 'Male',
      address: address ? address.trim() : '',
      emergency_contact: emergency_contact ? emergency_contact.trim() : '',
      registration_date: new Date().toISOString().split('T')[0],
      status: 'Active',
      assigned_trainer_id: assigned_trainer_id || 'TR-001',
      created_at: new Date().toISOString()
    };

    store.members.push(newMember);

    // Also auto-create a member user account
    if (email) {
      store.users.push({
        id: Date.now() + 1,
        email: email.trim().toLowerCase(),
        password: 'member123',
        name: full_name.trim(),
        role: 'member',
        related_id: member_id,
        phone: phone.trim(),
        status: 'Active',
        created_at: new Date().toISOString()
      });
    }

    store.notifications.unshift({
      id: Date.now() + 2,
      title: 'New Member Registered',
      message: `${newMember.full_name} (${newMember.member_id}) registered successfully.`,
      type: 'member',
      target_role: 'admin',
      target_id: null,
      read_status: false,
      created_at: new Date().toISOString()
    });

    saveStore(store);
    res.status(201).json({ success: true, data: newMember, message: 'Member registered successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const store = getStore();
    const idx = store.members.findIndex(m => String(m.id) === id || m.member_id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    store.members[idx] = {
      ...store.members[idx],
      ...req.body
    };
    saveStore(store);

    res.json({ success: true, data: store.members[idx], message: 'Member updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const store = getStore();
    const member = store.members.find(m => String(m.id) === id || m.member_id === id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    member.status = member.status === 'Inactive' ? 'Active' : 'Inactive';
    saveStore(store);

    res.json({ success: true, message: `Member status updated to ${member.status}`, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Membership Plans
router.get('/membership-plans', (req, res) => {
  try {
    const store = getStore();
    res.json({ success: true, data: store.membership_plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/membership-plans', (req, res) => {
  try {
    const { name, duration_months, price, description, status } = req.body;
    if (!name || !duration_months || !price) {
      return res.status(400).json({ success: false, message: 'Name, duration and price are required' });
    }
    const store = getStore();
    const newPlan = {
      id: Date.now(),
      name: name.trim(),
      duration_months: parseInt(duration_months, 10),
      price: parseFloat(price),
      description: description ? description.trim() : '',
      status: status || 'Active',
      created_at: new Date().toISOString()
    };
    store.membership_plans.push(newPlan);
    saveStore(store);
    res.status(201).json({ success: true, data: newPlan, message: 'Membership plan created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/membership-plans/:id', (req, res) => {
  try {
    const { id } = req.params;
    const store = getStore();
    const idx = store.membership_plans.findIndex(p => String(p.id) === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    store.membership_plans[idx] = { ...store.membership_plans[idx], ...req.body };
    saveStore(store);
    res.json({ success: true, data: store.membership_plans[idx], message: 'Plan updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Member Memberships (Assign Membership)
router.get('/member-memberships', (req, res) => {
  try {
    const store = getStore();
    const enriched = store.member_memberships.map(mm => {
      const member = store.members.find(m => m.member_id === mm.member_id);
      const plan = store.membership_plans.find(p => p.id === mm.plan_id);
      return {
        ...mm,
        member_name: member ? member.full_name : mm.member_id,
        member_phone: member ? member.phone : '',
        plan_name: plan ? plan.name : 'Unknown Plan'
      };
    });
    enriched.sort((a, b) => b.id - a.id);
    res.json({ success: true, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/member-memberships', (req, res) => {
  try {
    const { member_id, plan_id, start_date, end_date, amount, payment_method } = req.body;
    if (!member_id || !plan_id || !start_date) {
      return res.status(400).json({ success: false, message: 'Member, Plan, and Start Date are required.' });
    }

    const store = getStore();
    const member = store.members.find(m => m.member_id === member_id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    const plan = store.membership_plans.find(p => String(p.id) === String(plan_id));
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Membership plan not found.' });
    }

    let calculatedEndDate = end_date;
    if (!calculatedEndDate) {
      const s = new Date(start_date);
      s.setMonth(s.getMonth() + plan.duration_months);
      calculatedEndDate = s.toISOString().split('T')[0];
    }

    const finalAmount = amount !== undefined ? parseFloat(amount) : plan.price;

    const newAssignment = {
      id: Date.now(),
      member_id,
      plan_id: plan.id,
      start_date,
      end_date: calculatedEndDate,
      amount: finalAmount,
      status: 'Active',
      created_at: new Date().toISOString()
    };

    store.member_memberships.unshift(newAssignment);
    member.status = 'Active';

    if (payment_method) {
      const payment_id = generateNextInvoiceId(store.payments);
      const newPayment = {
        id: Date.now() + 2,
        payment_id,
        member_id,
        membership_id: newAssignment.id,
        amount: finalAmount,
        payment_date: start_date || new Date().toISOString().split('T')[0],
        payment_method: payment_method || 'Cash',
        transaction_reference: `ASSIGN-${Date.now().toString().slice(-6)}`,
        payment_status: 'Completed',
        notes: `Assigned Plan: ${plan.name}`,
        created_at: new Date().toISOString()
      };
      store.payments.unshift(newPayment);
    }

    store.notifications.unshift({
      id: Date.now() + 3,
      title: 'Membership Assigned',
      message: `${plan.name} assigned to ${member.full_name} (${member.member_id}) until ${calculatedEndDate}.`,
      type: 'system',
      target_role: 'all',
      target_id: null,
      read_status: false,
      created_at: new Date().toISOString()
    });

    saveStore(store);

    res.status(201).json({
      success: true,
      data: newAssignment,
      message: `Membership assigned successfully to ${member.full_name}`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Trainers
router.get('/trainers', (req, res) => {
  try {
    const { search } = req.query;
    const store = getStore();
    let trainers = [...store.trainers];
    if (search) {
      const q = search.toLowerCase();
      trainers = trainers.filter(t =>
        t.full_name.toLowerCase().includes(q) ||
        t.specialization.toLowerCase().includes(q) ||
        t.trainer_id.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, data: trainers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/trainers', (req, res) => {
  try {
    const { full_name, email, phone, specialization, experience, salary, bio } = req.body;
    if (!full_name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required.' });
    }

    const store = getStore();
    const trainer_id = generateNextTrainerId(store.trainers);
    const newTrainer = {
      id: Date.now(),
      trainer_id,
      full_name: full_name.trim(),
      email: email ? email.trim() : '',
      phone: phone.trim(),
      specialization: specialization ? specialization.trim() : 'Fitness & Bodybuilding',
      experience: experience ? experience.trim() : '2+ Years',
      salary: salary ? parseFloat(salary) : 0,
      bio: bio || 'Professional certified coach at RV FITNESS.',
      joining_date: new Date().toISOString().split('T')[0],
      status: 'Active',
      created_at: new Date().toISOString()
    };

    store.trainers.push(newTrainer);

    if (email) {
      store.users.push({
        id: Date.now() + 1,
        email: email.trim().toLowerCase(),
        password: 'trainer123',
        name: full_name.trim(),
        role: 'trainer',
        related_id: trainer_id,
        phone: phone.trim(),
        status: 'Active',
        created_at: new Date().toISOString()
      });
    }

    saveStore(store);
    res.status(201).json({ success: true, data: newTrainer, message: 'Trainer added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/trainers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const store = getStore();
    const idx = store.trainers.findIndex(t => String(t.id) === id || t.trainer_id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    store.trainers[idx] = { ...store.trainers[idx], ...req.body };
    saveStore(store);
    res.json({ success: true, data: store.trainers[idx], message: 'Trainer updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Payments
router.get('/payments', (req, res) => {
  try {
    const { search, status } = req.query;
    const store = getStore();
    let payments = store.payments.map(p => {
      const member = store.members.find(m => m.member_id === p.member_id);
      return {
        ...p,
        member_name: member ? member.full_name : p.member_id,
        member_phone: member ? member.phone : ''
      };
    });

    if (status && status !== 'All') {
      payments = payments.filter(p => p.payment_status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      payments = payments.filter(p =>
        p.payment_id.toLowerCase().includes(q) ||
        (p.member_name && p.member_name.toLowerCase().includes(q)) ||
        (p.transaction_reference && p.transaction_reference.toLowerCase().includes(q))
      );
    }

    payments.sort((a, b) => b.id - a.id);
    res.json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/payments', (req, res) => {
  try {
    const { member_id, amount, payment_method, transaction_reference, payment_status, notes } = req.body;
    if (!member_id || !amount || !payment_method) {
      return res.status(400).json({ success: false, message: 'Member, amount and payment method are required.' });
    }

    const store = getStore();
    const member = store.members.find(m => m.member_id === member_id);
    const payment_id = generateNextInvoiceId(store.payments);

    const newPayment = {
      id: Date.now(),
      payment_id,
      member_id,
      membership_id: null,
      amount: parseFloat(amount),
      payment_date: new Date().toISOString().split('T')[0],
      payment_method,
      transaction_reference: transaction_reference || `TXN-${Date.now().toString().slice(-6)}`,
      payment_status: payment_status || 'Completed',
      notes: notes || '',
      created_at: new Date().toISOString()
    };

    store.payments.unshift(newPayment);
    saveStore(store);

    res.status(201).json({ success: true, data: newPayment, message: 'Payment recorded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Attendance
router.get('/attendance', (req, res) => {
  try {
    const { date, search } = req.query;
    const store = getStore();
    let records = store.attendance.map(a => {
      const member = store.members.find(m => m.member_id === a.member_id);
      return {
        ...a,
        member_name: member ? member.full_name : a.member_id,
        member_phone: member ? member.phone : ''
      };
    });

    if (date) records = records.filter(a => a.date === date);
    if (search) {
      const q = search.toLowerCase();
      records = records.filter(a =>
        a.member_name.toLowerCase().includes(q) ||
        a.member_id.toLowerCase().includes(q)
      );
    }

    records.sort((a, b) => b.id - a.id);
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/attendance', (req, res) => {
  try {
    const { member_id, date, check_in_time, check_out_time, status } = req.body;
    if (!member_id) {
      return res.status(400).json({ success: false, message: 'Member ID is required.' });
    }

    const targetDate = date || new Date().toISOString().split('T')[0];
    const store = getStore();

    const existing = store.attendance.find(a => a.member_id === member_id && a.date === targetDate);
    if (existing) {
      return res.status(400).json({ success: false, message: `Attendance for member ${member_id} is already marked for ${targetDate}.` });
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newAttendance = {
      id: Date.now(),
      member_id,
      date: targetDate,
      check_in_time: check_in_time || timeStr,
      check_out_time: check_out_time || '',
      status: status || 'Present',
      created_at: new Date().toISOString()
    };

    store.attendance.unshift(newAttendance);
    saveStore(store);

    res.status(201).json({ success: true, data: newAttendance, message: 'Attendance marked successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Workout Plans
router.get('/workout-plans', (req, res) => {
  try {
    const store = getStore();
    const data = store.workout_plans.map(w => {
      const member = store.members.find(m => m.member_id === w.member_id);
      const trainer = store.trainers.find(t => t.trainer_id === w.trainer_id);
      return {
        ...w,
        member_name: member ? member.full_name : w.member_id,
        trainer_name: trainer ? trainer.full_name : 'Gym Trainer'
      };
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/workout-plans', (req, res) => {
  try {
    const { plan_name, member_id, trainer_id, goal, exercises, notes } = req.body;
    if (!plan_name || !member_id) {
      return res.status(400).json({ success: false, message: 'Plan name and member are required.' });
    }
    const store = getStore();
    const newPlan = {
      id: Date.now(),
      plan_name,
      member_id,
      trainer_id: trainer_id || null,
      goal: goal || 'Fitness & Strength',
      exercises: typeof exercises === 'string' ? exercises : JSON.stringify(exercises || []),
      notes: notes || '',
      created_at: new Date().toISOString()
    };
    store.workout_plans.unshift(newPlan);
    saveStore(store);
    res.status(201).json({ success: true, data: newPlan, message: 'Workout plan created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Diet Plans
router.get('/diet-plans', (req, res) => {
  try {
    const store = getStore();
    const data = store.diet_plans.map(d => {
      const member = store.members.find(m => m.member_id === d.member_id);
      return { ...d, member_name: member ? member.full_name : d.member_id };
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/diet-plans', (req, res) => {
  try {
    const { plan_name, member_id, calorie_target, meals, nutrition_notes } = req.body;
    if (!plan_name || !member_id) {
      return res.status(400).json({ success: false, message: 'Plan name and member are required.' });
    }
    const store = getStore();
    const newDiet = {
      id: Date.now(),
      plan_name,
      member_id,
      calorie_target: parseInt(calorie_target || 2000, 10),
      meals: typeof meals === 'string' ? meals : JSON.stringify(meals || []),
      nutrition_notes: nutrition_notes || '',
      created_at: new Date().toISOString()
    };
    store.diet_plans.unshift(newDiet);
    saveStore(store);
    res.status(201).json({ success: true, data: newDiet, message: 'Diet plan created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Progress Records
router.get('/progress-records', (req, res) => {
  try {
    const store = getStore();
    const records = store.progress_records.map(pr => {
      const member = store.members.find(m => m.member_id === pr.member_id);
      return { ...pr, member_name: member ? member.full_name : pr.member_id };
    });
    records.sort((a, b) => new Date(b.record_date) - new Date(a.record_date));
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/progress-records', (req, res) => {
  try {
    const { member_id, record_date, weight, height, chest, waist, arms, fitness_notes } = req.body;
    if (!member_id || !weight) {
      return res.status(400).json({ success: false, message: 'Member ID and weight are required.' });
    }
    const store = getStore();
    const newRecord = {
      id: Date.now(),
      member_id,
      record_date: record_date || new Date().toISOString().split('T')[0],
      weight: parseFloat(weight),
      height: height ? parseFloat(height) : null,
      chest: chest ? parseFloat(chest) : null,
      waist: waist ? parseFloat(waist) : null,
      arms: arms ? parseFloat(arms) : null,
      fitness_notes: fitness_notes || '',
      created_at: new Date().toISOString()
    };
    store.progress_records.unshift(newRecord);
    saveStore(store);
    res.status(201).json({ success: true, data: newRecord, message: 'Progress record saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Dashboard
router.get('/dashboard/stats', (req, res) => {
  try {
    const store = getStore();
    const totalMembers = store.members.length;
    const activeMembers = store.members.filter(m => m.status.toLowerCase() === 'active').length;
    const expiredMemberships = store.members.filter(m => m.status.toLowerCase() === 'expired').length;
    const totalTrainers = store.trainers.length;

    const currentMonthPrefix = new Date().toISOString().slice(0, 7);
    const monthlyRevenue = store.payments
      .filter(p => p.payment_status === 'Completed' && p.payment_date.startsWith(currentMonthPrefix))
      .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

    const totalRevenue = store.payments
      .filter(p => p.payment_status === 'Completed')
      .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

    const pendingPayments = store.payments.filter(p => p.payment_status === 'Pending').length;
    const recentMembers = store.members.slice(-4).reverse();
    const recentPayments = store.payments.slice(0, 4).map(p => {
      const member = store.members.find(m => m.member_id === p.member_id);
      return { ...p, member_name: member ? member.full_name : p.member_id };
    });

    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = store.attendance.filter(a => a.date === today).length;

    res.json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        expiredMemberships,
        totalTrainers,
        monthlyRevenue,
        totalRevenue,
        pendingPayments,
        todayAttendance,
        recentMembers,
        recentPayments
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/dashboard/charts', (req, res) => {
  try {
    const store = getStore();

    // Group completed payments by month dynamically
    const monthMap = {};
    (store.payments || []).forEach(p => {
      if (p.payment_status === 'Completed' && p.payment_date) {
        const monthKey = p.payment_date.slice(0, 7); // YYYY-MM
        const d = new Date(p.payment_date);
        const monthLabel = !isNaN(d.getTime())
          ? d.toLocaleString('default', { month: 'short' })
          : monthKey;
        if (!monthMap[monthKey]) {
          monthMap[monthKey] = { name: monthLabel, revenue: 0, members: new Set() };
        }
        monthMap[monthKey].revenue += (parseFloat(p.amount) || 0);
        if (p.member_id) monthMap[monthKey].members.add(p.member_id);
      }
    });

    const revenueByMonth = Object.keys(monthMap).sort().map(key => ({
      name: monthMap[key].name,
      revenue: monthMap[key].revenue,
      members: monthMap[key].members.size
    }));

    const planCounts = {};
    (store.membership_plans || []).forEach(p => { planCounts[p.name] = 0; });
    (store.member_memberships || []).forEach(mm => {
      const plan = store.membership_plans.find(p => p.id === mm.plan_id);
      if (plan) planCounts[plan.name] = (planCounts[plan.name] || 0) + 1;
    });
    const planDistribution = Object.keys(planCounts).map(name => ({
      name,
      value: planCounts[name] || 0
    }));

    res.json({
      success: true,
      data: {
        revenueByMonth,
        planDistribution
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Notifications
router.get('/notifications', (req, res) => {
  try {
    const store = getStore();
    res.json({ success: true, data: store.notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/notifications/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const store = getStore();
    const notif = store.notifications.find(n => String(n.id) === id);
    if (notif) notif.read_status = true;
    saveStore(store);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/notifications/mark-all-read', (req, res) => {
  try {
    const store = getStore();
    store.notifications.forEach(n => { n.read_status = true; });
    saveStore(store);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reports
router.get('/reports', (req, res) => {
  try {
    const store = getStore();
    const totalMembers = store.members.length;
    const active = store.members.filter(m => m.status.toLowerCase() === 'active').length;
    const expired = store.members.filter(m => m.status.toLowerCase() === 'expired').length;
    const inactive = store.members.filter(m => m.status.toLowerCase() === 'inactive').length;

    const totalIncome = store.payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
    const upiIncome = store.payments.filter(p => p.payment_method === 'UPI').reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
    const cashIncome = store.payments.filter(p => p.payment_method === 'Cash').reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
    const cardIncome = store.payments.filter(p => p.payment_method === 'Card').reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);

    res.json({
      success: true,
      data: {
        membershipStats: { totalMembers, active, expired, inactive },
        financialStats: { totalIncome, upiIncome, cashIncome, cardIncome, totalInvoices: store.payments.length },
        trainerCount: store.trainers.length,
        totalAttendanceLogs: store.attendance.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Settings
router.get('/settings', (req, res) => {
  try {
    const store = getStore();
    res.json({ success: true, data: store.gym_settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/settings', (req, res) => {
  try {
    const store = getStore();
    store.gym_settings = { ...store.gym_settings, ...req.body };
    saveStore(store);
    res.json({ success: true, data: store.gym_settings, message: 'Settings saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
