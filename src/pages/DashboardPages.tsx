import { useMemo, useState } from 'react'
import { Icon, type IconName } from '../components/Icon'
import { Modal } from '../components/Modal'
import type { Role } from '../lib/types'

type Stat = { icon: IconName; label: string; value: string; note: string; tone?: 'teal' | 'blue' | 'amber' | 'red' }
type BadgeTone = 'green' | 'amber' | 'blue' | 'red' | 'dark' | 'neutral'
type Cell = string | { text: string; tone: BadgeTone }
type Row = { id: string; cells: Cell[]; meta?: string }

type CollectionConfig = {
  title: string
  subtitle: string
  eyebrow: string
  action: string
  actionIcon: IconName
  stats: Stat[]
  columns: string[]
  rows: Row[]
  cardTitle?: string
  cards?: Array<{ title: string; subtitle: string; image?: string; icon?: IconName; status: string; statusTone: BadgeTone; meta: string[]; progress?: number }>
}

type BoardConfig = {
  title: string
  subtitle: string
  eyebrow: string
  action: string
  actionIcon: IconName
  stats: Stat[]
  lanes: Array<{ title: string; count: number; tone: BadgeTone; cards: Array<{ id: string; title: string; subtitle: string; details: string; time: string; amount?: string; priority?: string }> }>
}

const propertyCards: CollectionConfig['cards'] = [
  { title: 'Marina Bay Apartments', subtitle: 'Westlands, Nairobi', image: '/assets/property-city.svg', status: '92% occupied', statusTone: 'green', meta: ['18 units', 'KES 642K monthly', '3 open requests'], progress: 92 },
  { title: 'Spring Valley Villas', subtitle: 'Lower Kabete, Nairobi', image: '/assets/property-villa.svg', status: 'Fully occupied', statusTone: 'green', meta: ['12 homes', 'KES 1.08M monthly', '1 renewal due'], progress: 100 },
  { title: 'Coastal Haven Suites', subtitle: 'Nyali, Mombasa', image: '/assets/property-coast.svg', status: '78% booked', statusTone: 'blue', meta: ['9 suites', '6 arrivals this week', 'KES 318K forecast'], progress: 78 },
]

const collectionConfigs: Record<string, CollectionConfig> = {
  'owner:Properties': {
    eyebrow: 'Portfolio', title: 'Properties', subtitle: 'Manage every property, building and short-stay listing from one elegant workspace.', action: 'Add property', actionIcon: 'plus',
    stats: [
      { icon: 'building', label: 'Total properties', value: '12', note: 'Across 4 locations' },
      { icon: 'home', label: 'Total units', value: '51', note: '46 currently occupied' },
      { icon: 'wallet', label: 'Monthly potential', value: 'KES 2.24M', note: 'Long and short stays' },
      { icon: 'tool', label: 'Under maintenance', value: '3', note: '2 returning this week', tone: 'amber' },
    ],
    columns: ['Property', 'Type', 'Units', 'Occupancy', 'Manager', 'Monthly income', 'Status'],
    rows: [
      { id: 'PROP-001', cells: ['Marina Bay Apartments', 'Residential', '18', '92%', 'Grace Wanjiku', 'KES 642,000', { text: 'Active', tone: 'green' }] },
      { id: 'PROP-002', cells: ['Spring Valley Villas', 'Residential', '12', '100%', 'Brian Mwangi', 'KES 1,080,000', { text: 'Active', tone: 'green' }] },
      { id: 'PROP-003', cells: ['Coastal Haven Suites', 'Short stay', '9', '78%', 'Aisha Noor', 'KES 318,000', { text: 'High season', tone: 'blue' }] },
      { id: 'PROP-004', cells: ['Kilimani Heights', 'Mixed use', '12', '84%', 'Mercy Njeri', 'KES 510,000', { text: 'Attention', tone: 'amber' }] },
    ],
    cardTitle: 'Portfolio at a glance', cards: propertyCards,
  },
  'owner:Units & tenants': {
    eyebrow: 'Occupancy', title: 'Units & tenants', subtitle: 'See occupancy, lease health, arrears and resident activity without moving between spreadsheets.', action: 'Add tenant', actionIcon: 'users',
    stats: [
      { icon: 'home', label: 'Occupied units', value: '46', note: '91% portfolio occupancy' },
      { icon: 'key', label: 'Vacant units', value: '5', note: '3 ready to list', tone: 'blue' },
      { icon: 'wallet', label: 'Rent overdue', value: 'KES 118K', note: '4 tenant accounts', tone: 'red' },
      { icon: 'clipboard', label: 'Renewals due', value: '7', note: 'Within 60 days', tone: 'amber' },
    ],
    columns: ['Unit', 'Property', 'Tenant / guest', 'Lease or stay', 'Amount', 'Payment', 'Status'],
    rows: [
      { id: 'UNIT-A5G', cells: ['A5G', 'Marina Bay', 'Amina Hassan', 'Ends 30 Apr 2027', 'KES 28,000', { text: 'Paid', tone: 'green' }, { text: 'Occupied', tone: 'green' }] },
      { id: 'UNIT-B204', cells: ['B204', 'Kilimani Heights', 'Kevin Otieno', 'Ends 31 Oct 2026', 'KES 42,000', { text: '7 days overdue', tone: 'red' }, { text: 'Occupied', tone: 'green' }] },
      { id: 'UNIT-S06', cells: ['Suite 06', 'Coastal Haven', 'Sarah Ahura', '28–30 Aug 2026', 'KES 17,600', { text: 'Paid', tone: 'green' }, { text: 'Reserved', tone: 'blue' }] },
      { id: 'UNIT-A102', cells: ['A102', 'Marina Bay', '—', 'Available now', 'KES 30,000', { text: '—', tone: 'neutral' }, { text: 'Vacant', tone: 'amber' }] },
      { id: 'UNIT-H12', cells: ['House 12', 'Spring Valley Villas', 'Joan & Peter Kimani', 'Ends 31 Aug 2026', 'KES 95,000', { text: 'Paid', tone: 'green' }, { text: 'Renewal due', tone: 'amber' }] },
    ],
  },
  'owner:Providers': {
    eyebrow: 'Service network', title: 'Service providers', subtitle: 'Build a trusted network, compare performance and keep every service record auditable.', action: 'Invite provider', actionIcon: 'plus',
    stats: [
      { icon: 'briefcase', label: 'Active providers', value: '24', note: 'Across 11 categories' },
      { icon: 'star', label: 'Average rating', value: '4.7', note: 'From 186 completed jobs' },
      { icon: 'tool', label: 'Jobs in progress', value: '7', note: '2 completing today', tone: 'blue' },
      { icon: 'shield', label: 'Documents expiring', value: '3', note: 'Within 30 days', tone: 'amber' },
    ],
    columns: ['Provider', 'Services', 'Coverage', 'Rating', 'Active jobs', 'Outstanding', 'Verification'],
    rows: [
      { id: 'PROV-001', cells: ['DenzeK Services', 'Moving · Repairs', 'Nairobi', '4.8 / 5', '3', 'KES 22,000', { text: 'Verified', tone: 'green' }] },
      { id: 'PROV-002', cells: ['Sparkline Electricals', 'Electrical', 'Nairobi · Kiambu', '4.9 / 5', '2', 'KES 8,500', { text: 'Verified', tone: 'green' }] },
      { id: 'PROV-003', cells: ['Safisha Pro', 'Cleaning · Laundry', 'Nairobi · Mombasa', '4.6 / 5', '1', 'KES 14,000', { text: 'Verified', tone: 'green' }] },
      { id: 'PROV-004', cells: ['AquaFix Plumbing', 'Plumbing', 'Nairobi', '4.5 / 5', '1', 'KES 0', { text: 'Document due', tone: 'amber' }] },
    ],
  },
  'tenant:Lease & documents': {
    eyebrow: 'My tenancy', title: 'Lease & documents', subtitle: 'Your signed lease, property rules, inspection records and important documents in one secure place.', action: 'Request renewal', actionIcon: 'clipboard',
    stats: [
      { icon: 'clipboard', label: 'Lease status', value: 'Active', note: '8 months remaining' },
      { icon: 'calendar', label: 'Lease expiry', value: '30 Apr 2027', note: 'Renewal available in February' },
      { icon: 'wallet', label: 'Deposit held', value: 'KES 56K', note: 'Two months’ rent' },
      { icon: 'shield', label: 'Documents', value: '7', note: 'All verified and current' },
    ],
    columns: ['Document', 'Category', 'Issued', 'Expiry', 'Signed by', 'Version', 'Status'],
    rows: [
      { id: 'DOC-LEASE', cells: ['Residential lease agreement', 'Lease', '1 May 2026', '30 Apr 2027', 'Tenant & owner', 'v2.1', { text: 'Signed', tone: 'green' }] },
      { id: 'DOC-RULES', cells: ['Marina Bay resident handbook', 'Property rules', '1 May 2026', '—', 'Facility manager', 'v4.0', { text: 'Current', tone: 'blue' }] },
      { id: 'DOC-INSPECT', cells: ['Move-in inspection report', 'Inspection', '1 May 2026', '—', 'Tenant & caretaker', 'Final', { text: 'Acknowledged', tone: 'green' }] },
      { id: 'DOC-ID', cells: ['Tenant identification record', 'Identity', '29 Apr 2026', '29 Apr 2036', 'System verification', 'Secure', { text: 'Verified', tone: 'green' }] },
    ],
  },
  'tenant:Visitors': {
    eyebrow: 'Access & security', title: 'Visitor passes', subtitle: 'Create secure visitor access, share arrival instructions and see when guests check in or out.', action: 'Create visitor pass', actionIcon: 'plus',
    stats: [
      { icon: 'users', label: 'Active passes', value: '1', note: 'Valid until 8:00 PM' },
      { icon: 'calendar', label: 'Scheduled visitors', value: '3', note: 'Within the next 7 days' },
      { icon: 'shield', label: 'Checked in today', value: '2', note: 'All verified at the gate' },
      { icon: 'clock', label: 'Average clearance', value: '1m 42s', note: 'This month' },
    ],
    columns: ['Visitor', 'Phone', 'Purpose', 'Valid date', 'Access window', 'Gate', 'Status'],
    rows: [
      { id: 'VIS-2401', cells: ['Tracy Achieng', '+254 712 456 890', 'Personal visit', '4 Aug 2026', '2:00–8:00 PM', 'Main gate', { text: 'Active', tone: 'green' }] },
      { id: 'VIS-2402', cells: ['DenzeK Services', '+254 769 778 549', 'Maintenance', '4 Aug 2026', '2:30–3:30 PM', 'Service gate', { text: 'Scheduled', tone: 'blue' }] },
      { id: 'VIS-2403', cells: ['Mary Wambui', '+254 722 334 901', 'Delivery', '6 Aug 2026', '10:00–11:00 AM', 'Main gate', { text: 'Scheduled', tone: 'blue' }] },
    ],
  },
  'provider:Opportunities': {
    eyebrow: 'Work marketplace', title: 'Qualified opportunities', subtitle: 'Review jobs matching your services, location, documents and real-time availability.', action: 'Update availability', actionIcon: 'calendar',
    stats: [
      { icon: 'briefcase', label: 'Matched today', value: '8', note: '3 high-fit opportunities' },
      { icon: 'map', label: 'Within 10 km', value: '5', note: 'Nairobi coverage area' },
      { icon: 'wallet', label: 'Potential value', value: 'KES 76K', note: 'Across open opportunities' },
      { icon: 'clock', label: 'Average response', value: '14 min', note: 'Top 12% of providers' },
    ],
    columns: ['Opportunity', 'Property', 'Distance', 'Required date', 'Budget', 'Match', 'Status'],
    rows: [
      { id: 'OPP-4821', cells: ['Emergency plumbing', 'Spring Valley Villas', '3.2 km', 'Today · 4:00 PM', 'KES 8K–15K', '96%', { text: 'New', tone: 'blue' }] },
      { id: 'OPP-4822', cells: ['Office move support', 'Westlands Business Park', '6.4 km', '8 Aug · 8:00 AM', 'KES 25K–40K', '91%', { text: 'Quote requested', tone: 'amber' }] },
      { id: 'OPP-4823', cells: ['Furniture assembly', 'Kilimani Heights', '5.7 km', '6 Aug · 2:00 PM', 'KES 6K–10K', '88%', { text: 'Open', tone: 'green' }] },
      { id: 'OPP-4824', cells: ['Appliance relocation', 'Marina Bay Apartments', '7.1 km', '10 Aug · 10:00 AM', 'KES 12K–18K', '84%', { text: 'Open', tone: 'green' }] },
    ],
  },
  'provider:Reviews': {
    eyebrow: 'Reputation', title: 'Ratings & reviews', subtitle: 'Understand what clients value, respond professionally and turn service quality into more work.', action: 'Share review link', actionIcon: 'star',
    stats: [
      { icon: 'star', label: 'Overall rating', value: '4.8', note: '42 verified reviews' },
      { icon: 'check', label: 'Five-star reviews', value: '35', note: '83% of all reviews' },
      { icon: 'clock', label: 'On-time score', value: '96%', note: 'Across completed jobs' },
      { icon: 'message', label: 'Response rate', value: '100%', note: 'All feedback acknowledged' },
    ],
    columns: ['Client', 'Property', 'Service', 'Rating', 'Comment', 'Date', 'Response'],
    rows: [
      { id: 'REV-901', cells: ['Amina Hassan', 'Marina Bay', 'Moving support', '5.0', 'Careful, timely and very professional.', '1 Aug 2026', { text: 'Responded', tone: 'green' }] },
      { id: 'REV-902', cells: ['Grace Wanjiku', 'Kilimani Heights', 'Furniture assembly', '4.8', 'Clear quotation and excellent updates.', '28 Jul 2026', { text: 'Responded', tone: 'green' }] },
      { id: 'REV-903', cells: ['Peter Kimani', 'Spring Valley Villas', 'Move-in service', '4.6', 'Good work; arrival was slightly delayed.', '20 Jul 2026', { text: 'Response due', tone: 'amber' }] },
    ],
  },
  'admin:Organizations': {
    eyebrow: 'Platform accounts', title: 'Organizations', subtitle: 'Manage property companies, independent owners, facility teams and their subscription health.', action: 'Add organization', actionIcon: 'plus',
    stats: [
      { icon: 'building', label: 'Organizations', value: '38', note: '26 paid · 12 trials' },
      { icon: 'home', label: 'Properties managed', value: '214', note: 'Across the platform' },
      { icon: 'users', label: 'Organization users', value: '876', note: 'Owners, staff and tenants' },
      { icon: 'wallet', label: 'Monthly recurring', value: 'KES 684K', note: '+11.2% this month' },
    ],
    columns: ['Organization', 'Plan', 'Properties', 'Users', 'Monthly value', 'Renewal', 'Status'],
    rows: [
      { id: 'ORG-001', cells: ['Marina Property Group', 'Portfolio Pro', '12', '86', 'KES 42,000', '18 Aug 2026', { text: 'Active', tone: 'green' }] },
      { id: 'ORG-002', cells: ['Kilele Facility Managers', 'Enterprise', '31', '244', 'KES 95,000', '1 Sep 2026', { text: 'Active', tone: 'green' }] },
      { id: 'ORG-003', cells: ['Coastal Haven Stays', 'Stay Plus', '4', '28', 'KES 18,500', 'Trial ends 12 Aug', { text: 'Trial', tone: 'blue' }] },
      { id: 'ORG-004', cells: ['Oakline Apartments', 'Starter', '2', '17', 'KES 7,500', 'Payment overdue', { text: 'At risk', tone: 'red' }] },
    ],
  },
  'admin:Users': {
    eyebrow: 'Identity & access', title: 'Users', subtitle: 'See every account, role, organization and access event across the MongaLets ecosystem.', action: 'Invite user', actionIcon: 'users',
    stats: [
      { icon: 'users', label: 'Active users', value: '1,248', note: 'Across all role types' },
      { icon: 'home', label: 'Tenants & guests', value: '902', note: '72% of user base' },
      { icon: 'briefcase', label: 'Providers', value: '164', note: '112 fully verified' },
      { icon: 'shield', label: 'Access flags', value: '4', note: 'Require review', tone: 'red' },
    ],
    columns: ['User', 'Role', 'Organization', 'Last active', 'Sign-in method', 'Security', 'Status'],
    rows: [
      { id: 'USR-001', cells: ['Denzel Opondo', 'Owner', 'Marina Property Group', 'Now', 'Password + OTP', { text: 'MFA active', tone: 'green' }, { text: 'Active', tone: 'green' }] },
      { id: 'USR-002', cells: ['Amina Hassan', 'Tenant', 'Marina Property Group', '8 min ago', 'Magic link', { text: 'Verified', tone: 'green' }, { text: 'Active', tone: 'green' }] },
      { id: 'USR-003', cells: ['DenzeK Services', 'Provider', 'Independent', '14 min ago', 'Password + OTP', { text: 'MFA active', tone: 'green' }, { text: 'Active', tone: 'green' }] },
      { id: 'USR-004', cells: ['Sarah Ahura', 'Guest', 'Coastal Haven Stays', 'Yesterday', 'Booking OTP', { text: 'Phone verified', tone: 'blue' }, { text: 'Guest access', tone: 'blue' }] },
    ],
  },
  'admin:Providers': {
    eyebrow: 'Marketplace network', title: 'Providers', subtitle: 'Monitor provider quality, service coverage, jobs, earnings and marketplace risk.', action: 'Invite provider', actionIcon: 'plus',
    stats: [
      { icon: 'briefcase', label: 'Registered providers', value: '164', note: '112 fully verified' },
      { icon: 'tool', label: 'Jobs this month', value: '1,842', note: '93% completed on time' },
      { icon: 'wallet', label: 'Marketplace value', value: 'KES 8.6M', note: '+16% month on month' },
      { icon: 'alert', label: 'Open disputes', value: '6', note: '2 escalated', tone: 'red' },
    ],
    columns: ['Provider', 'Categories', 'Coverage', 'Rating', 'Jobs', 'Marketplace value', 'Risk'],
    rows: [
      { id: 'APR-001', cells: ['DenzeK Services', 'Moving · Repairs', 'Nairobi', '4.8', '64', 'KES 1.24M', { text: 'Low', tone: 'green' }] },
      { id: 'APR-002', cells: ['Safisha Pro', 'Cleaning · Laundry', 'Kenya-wide', '4.6', '118', 'KES 1.86M', { text: 'Low', tone: 'green' }] },
      { id: 'APR-003', cells: ['AquaFix Plumbing', 'Plumbing', 'Nairobi', '4.5', '43', 'KES 722K', { text: 'Review docs', tone: 'amber' }] },
      { id: 'APR-004', cells: ['RapidFix Solutions', 'General repairs', 'Nakuru', '3.9', '26', 'KES 281K', { text: 'Watch', tone: 'red' }] },
    ],
  },
  'admin:Verification': {
    eyebrow: 'Trust & compliance', title: 'Verification queue', subtitle: 'Review provider identity, business, insurance, licences and service evidence with a complete audit trail.', action: 'Create verification rule', actionIcon: 'shield',
    stats: [
      { icon: 'shield', label: 'Pending reviews', value: '8', note: '3 marked urgent' },
      { icon: 'clock', label: 'Average review time', value: '4h 18m', note: 'Within 8-hour target' },
      { icon: 'check', label: 'Approved this week', value: '27', note: '96% first-pass quality' },
      { icon: 'alert', label: 'Escalated', value: '2', note: 'Manual identity review', tone: 'red' },
    ],
    columns: ['Provider', 'Document set', 'Submitted', 'Automated checks', 'Reviewer', 'SLA', 'Status'],
    rows: [
      { id: 'VER-882', cells: ['AquaFix Plumbing', 'Insurance renewal', 'Today · 8:22 AM', '6 / 7 passed', 'Unassigned', '2h remaining', { text: 'Urgent', tone: 'red' }] },
      { id: 'VER-883', cells: ['Nairobi Movers Hub', 'New provider pack', 'Yesterday · 4:10 PM', '11 / 11 passed', 'M. Wanjiku', '5h remaining', { text: 'Ready to approve', tone: 'green' }] },
      { id: 'VER-884', cells: ['Luxe Cleaning Co.', 'Business licence', 'Yesterday · 2:30 PM', '8 / 9 passed', 'J. Omondi', '7h remaining', { text: 'Review', tone: 'amber' }] },
      { id: 'VER-885', cells: ['Bright Spark Electricals', 'Identity update', '2 Aug · 11:18 AM', '4 / 4 passed', 'A. Noor', 'On time', { text: 'In review', tone: 'blue' }] },
    ],
  },
}

const boardConfigs: Record<string, BoardConfig> = {
  'owner:Requests': {
    eyebrow: 'Facility operations', title: 'Requests & maintenance', subtitle: 'Coordinate reports, quotations, schedules, providers, approvals and proof of completion.', action: 'Create request', actionIcon: 'plus',
    stats: [
      { icon: 'tool', label: 'Open requests', value: '9', note: 'Across 5 properties' },
      { icon: 'alert', label: 'Urgent', value: '4', note: '2 outside SLA', tone: 'red' },
      { icon: 'receipt', label: 'Awaiting approval', value: '2', note: 'KES 36,500 total', tone: 'amber' },
      { icon: 'check', label: 'Resolved this month', value: '31', note: 'Average 19 hours' },
    ],
    lanes: [
      { title: 'New & triage', count: 3, tone: 'blue', cards: [
        { id: 'REQ-2408', title: 'Water leak below sink', subtitle: 'Marina Bay · A5G', details: 'Reported with 3 photos by Amina Hassan.', time: '11 min ago', priority: 'Urgent' },
        { id: 'REQ-2409', title: 'Noisy generator after 10 PM', subtitle: 'Marina Bay · Floor 5', details: 'Resident complaint affecting two units.', time: '31 min ago' },
      ] },
      { title: 'Awaiting approval', count: 2, tone: 'amber', cards: [
        { id: 'REQ-2398', title: 'Replace water pump', subtitle: 'Spring Valley · House 12', details: 'AquaFix submitted labour and materials.', time: '1h ago', amount: 'KES 28,000' },
        { id: 'REQ-2394', title: 'Deep-clean vacant unit', subtitle: 'Kilimani Heights · B102', details: 'Safisha Pro quotation ready.', time: '3h ago', amount: 'KES 8,500' },
      ] },
      { title: 'Scheduled & active', count: 4, tone: 'green', cards: [
        { id: 'REQ-2388', title: 'Move-in support', subtitle: 'Marina Bay · A5G', details: 'DenzeK arriving today at 2:30 PM.', time: 'Today', amount: 'KES 20,000' },
        { id: 'REQ-2381', title: 'Electrical inspection', subtitle: 'Kilimani Heights · C204', details: 'Sparkline Electricals checked in.', time: 'In progress' },
      ] },
    ],
  },
  'tenant:My requests': {
    eyebrow: 'My home', title: 'Maintenance requests', subtitle: 'Report issues with photos, select a convenient time and follow every update in real time.', action: 'Report an issue', actionIcon: 'camera',
    stats: [
      { icon: 'tool', label: 'Open requests', value: '2', note: '1 provider scheduled' },
      { icon: 'clock', label: 'Next visit', value: '2:30 PM', note: 'DenzeK Services today' },
      { icon: 'check', label: 'Resolved', value: '8', note: 'Since move-in' },
      { icon: 'star', label: 'Service rating', value: '4.9', note: 'Your average feedback score' },
    ],
    lanes: [
      { title: 'Submitted', count: 1, tone: 'blue', cards: [{ id: 'REQ-2409', title: 'Noise complaint', subtitle: 'Building B · Floor 5', details: 'Facility team is reviewing your report.', time: 'Today · 10:50 AM' }] },
      { title: 'Scheduled', count: 1, tone: 'amber', cards: [{ id: 'REQ-2388', title: 'Move-in support', subtitle: 'Apartment A5G', details: 'DenzeK Services will arrive between 2:30 and 3:30 PM.', time: 'Today', amount: 'KES 20,000' }] },
      { title: 'Recently completed', count: 2, tone: 'green', cards: [{ id: 'REQ-2321', title: 'Bathroom tap repair', subtitle: 'Apartment A5G', details: 'Completed and confirmed. Rated 5 stars.', time: '29 Jul 2026' }, { id: 'REQ-2288', title: 'Internet router relocation', subtitle: 'Living room', details: 'Completed with before-and-after evidence.', time: '18 Jul 2026' }] },
    ],
  },
  'provider:My jobs': {
    eyebrow: 'Field operations', title: 'My jobs', subtitle: 'Move each assignment from approval to route, check-in, work evidence and payment.', action: 'Upload proof of work', actionIcon: 'camera',
    stats: [
      { icon: 'calendar', label: 'Today', value: '3 jobs', note: 'First at 2:30 PM' },
      { icon: 'tool', label: 'In progress', value: '4', note: 'Across 3 properties' },
      { icon: 'check', label: 'Awaiting confirmation', value: '2', note: 'KES 17,500 pending' },
      { icon: 'clock', label: 'On-time rate', value: '96%', note: 'Last 90 days' },
    ],
    lanes: [
      { title: 'Scheduled', count: 3, tone: 'blue', cards: [{ id: 'JOB-818', title: 'Move-in support', subtitle: 'Marina Bay · 2:30 PM', details: 'Access code and loading bay reserved.', time: 'Today', amount: 'KES 20,000' }, { id: 'JOB-822', title: 'Furniture assembly', subtitle: 'Kilimani Heights · 4:15 PM', details: 'Client has confirmed access.', time: 'Today', amount: 'KES 6,500' }] },
      { title: 'In progress', count: 1, tone: 'amber', cards: [{ id: 'JOB-814', title: 'Office relocation', subtitle: 'Westlands Business Park', details: 'Team checked in. 2 of 4 milestones complete.', time: 'Started 10:10 AM', amount: 'KES 45,000' }] },
      { title: 'Awaiting confirmation', count: 2, tone: 'green', cards: [{ id: 'JOB-799', title: 'Appliance relocation', subtitle: 'Spring Valley · House 8', details: 'Completion photos and client signature uploaded.', time: 'Yesterday', amount: 'KES 12,000' }, { id: 'JOB-792', title: 'Move-out support', subtitle: 'Marina Bay · B304', details: 'Facility manager reviewing final checklist.', time: '2 Aug 2026', amount: 'KES 15,500' }] },
    ],
  },
  'provider:Quotations': {
    eyebrow: 'Sales pipeline', title: 'Quotations', subtitle: 'Build professional estimates, track approvals and convert accepted offers into scheduled work.', action: 'Create quotation', actionIcon: 'receipt',
    stats: [
      { icon: 'receipt', label: 'Drafts', value: '2', note: 'KES 31,500 potential' },
      { icon: 'clock', label: 'Awaiting decision', value: '4', note: 'Average age 18 hours' },
      { icon: 'check', label: 'Accepted this month', value: '12', note: 'KES 214,000 total' },
      { icon: 'chart', label: 'Conversion rate', value: '68%', note: '+7% versus July' },
    ],
    lanes: [
      { title: 'Draft', count: 2, tone: 'neutral', cards: [{ id: 'QT-1088', title: 'Office move support', subtitle: 'Westlands Business Park', details: 'Labour, truck and packing materials.', time: 'Edited 18 min ago', amount: 'KES 38,500' }] },
      { title: 'Sent', count: 4, tone: 'blue', cards: [{ id: 'QT-1082', title: 'Moving service', subtitle: 'Marina Bay · A5G', details: 'Client viewed 42 minutes ago.', time: 'Sent today', amount: 'KES 20,000' }, { id: 'QT-1079', title: 'Furniture assembly', subtitle: 'Kilimani Heights', details: 'Awaiting facility manager review.', time: 'Sent yesterday', amount: 'KES 6,500' }] },
      { title: 'Accepted', count: 3, tone: 'green', cards: [{ id: 'QT-1068', title: 'Move-out service', subtitle: 'Marina Bay · B304', details: 'Converted to JOB-792 and completed.', time: 'Accepted 1 Aug', amount: 'KES 15,500' }] },
    ],
  },
  'admin:Integrity centre': {
    eyebrow: 'Data & risk', title: 'Integrity centre', subtitle: 'Resolve duplicate records, unusual activity, failed syncs and data-quality exceptions before they affect operations.', action: 'Create integrity rule', actionIcon: 'shield',
    stats: [
      { icon: 'alert', label: 'Open cases', value: '3', note: '1 high priority', tone: 'red' },
      { icon: 'sync', label: 'Sync exceptions', value: '12', note: '9 auto-recoverable', tone: 'amber' },
      { icon: 'check', label: 'Resolved this week', value: '41', note: '96% within SLA' },
      { icon: 'shield', label: 'Risk score', value: 'Low', note: 'Platform-wide assessment' },
    ],
    lanes: [
      { title: 'High priority', count: 1, tone: 'red', cards: [{ id: 'INT-308', title: 'Possible duplicate payment', subtitle: 'Marina Property Group', details: 'Two M-Pesa callbacks share the same receipt reference.', time: '9 min ago', amount: 'KES 28,000', priority: 'High' }] },
      { title: 'Needs review', count: 2, tone: 'amber', cards: [{ id: 'INT-307', title: 'Provider identity mismatch', subtitle: 'RapidFix Solutions', details: 'Business registration name differs from payout name.', time: '1h ago' }, { id: 'INT-306', title: 'Unit occupancy conflict', subtitle: 'Kilimani Heights · B102', details: 'Unit appears vacant but has an active lease draft.', time: '3h ago' }] },
      { title: 'Auto-recovery', count: 9, tone: 'blue', cards: [{ id: 'INT-305', title: 'Delayed SMS delivery receipts', subtitle: 'FikraWorks BulkSMS', details: 'Provider callback retry is running automatically.', time: 'Recovering' }] },
    ],
  },
}

const pageMeta: Record<string, { title: string; subtitle: string; eyebrow: string; action: string; icon: IconName; stats: Stat[] }> = {
  'owner:Calendar': { eyebrow: 'Portfolio schedule', title: 'Calendar', subtitle: 'Coordinate rent dates, inspections, arrivals, departures, maintenance and staff assignments.', action: 'Create event', icon: 'plus', stats: [{ icon: 'calendar', label: 'Events this week', value: '26', note: 'Across all properties' }, { icon: 'key', label: 'Arrivals & departures', value: '9', note: '6 arrivals · 3 departures' }, { icon: 'tool', label: 'Service appointments', value: '7', note: '2 today' }, { icon: 'clipboard', label: 'Inspections', value: '4', note: 'All assigned' }] },
  'tenant:Calendar': { eyebrow: 'My schedule', title: 'Calendar', subtitle: 'Keep rent dates, property appointments, visitors and community events in one clear view.', action: 'Add personal reminder', icon: 'plus', stats: [{ icon: 'calendar', label: 'Upcoming events', value: '6', note: 'Next 30 days' }, { icon: 'tool', label: 'Service visits', value: '1', note: 'Today at 2:30 PM' }, { icon: 'wallet', label: 'Next rent due', value: '1 Sep', note: 'KES 28,000' }, { icon: 'users', label: 'Visitor passes', value: '3', note: 'Scheduled this week' }] },
  'provider:Schedule': { eyebrow: 'Availability', title: 'Schedule', subtitle: 'Plan jobs, travel buffers, quotation visits and team availability without overbooking.', action: 'Block time', icon: 'calendar', stats: [{ icon: 'calendar', label: 'Jobs this week', value: '14', note: '3 today' }, { icon: 'clock', label: 'Booked hours', value: '31.5', note: '78% utilisation' }, { icon: 'map', label: 'Travel time', value: '5h 20m', note: 'Route-optimised estimate' }, { icon: 'users', label: 'Team available', value: '4 / 5', note: 'One member on leave' }] },
  'owner:Finances': { eyebrow: 'Portfolio finance', title: 'Finances', subtitle: 'Track rent, booking income, expenses, deposits, provider liabilities and property profitability.', action: 'Record transaction', icon: 'plus', stats: [{ icon: 'wallet', label: 'Collected this month', value: 'KES 1.84M', note: '94% of expected' }, { icon: 'receipt', label: 'Expenses', value: 'KES 384K', note: '21% of collected income' }, { icon: 'chart', label: 'Net operating income', value: 'KES 1.46M', note: '+8.4% month on month' }, { icon: 'alert', label: 'Outstanding', value: 'KES 118K', note: '4 tenant accounts', tone: 'red' }] },
  'tenant:Rent & payments': { eyebrow: 'My account', title: 'Rent & payments', subtitle: 'Pay securely, see what is due, download receipts and understand your complete account history.', action: 'Pay rent', icon: 'wallet', stats: [{ icon: 'check', label: 'Current status', value: 'Paid', note: 'August rent received' }, { icon: 'calendar', label: 'Next due', value: '1 Sep 2026', note: 'KES 28,000' }, { icon: 'wallet', label: 'Deposit balance', value: 'KES 56K', note: 'Held securely' }, { icon: 'receipt', label: 'Receipts', value: '5', note: 'Available to download' }] },
  'provider:Earnings': { eyebrow: 'Business finance', title: 'Earnings & payouts', subtitle: 'See completed work, pending confirmations, deductions, statements and payout timelines.', action: 'Request payout', icon: 'wallet', stats: [{ icon: 'wallet', label: 'August earnings', value: 'KES 86.2K', note: '+12.8% versus July' }, { icon: 'clock', label: 'Pending confirmation', value: 'KES 22K', note: '2 completed jobs' }, { icon: 'check', label: 'Ready for payout', value: 'KES 54.7K', note: 'Next cycle 7 Aug' }, { icon: 'receipt', label: 'Platform fees', value: 'KES 4.3K', note: '5% marketplace fee' }] },
  'guest:Receipt': { eyebrow: 'Booking payment', title: 'Receipt & charges', subtitle: 'A transparent breakdown of your stay, taxes, services, payments and refundable amounts.', action: 'Download receipt', icon: 'receipt', stats: [{ icon: 'wallet', label: 'Total paid', value: 'KES 17,600', note: 'Paid 27 Jul 2026' }, { icon: 'calendar', label: 'Stay length', value: '2 nights', note: '28–30 Aug 2026' }, { icon: 'receipt', label: 'Tax included', value: 'KES 1,600', note: '10% accommodation tax' }, { icon: 'check', label: 'Balance', value: 'KES 0', note: 'Payment complete' }] },
  'admin:Subscriptions': { eyebrow: 'Commercial operations', title: 'Subscriptions', subtitle: 'Manage plans, trials, billing cycles, failed payments, upgrades and revenue retention.', action: 'Create plan', icon: 'plus', stats: [{ icon: 'wallet', label: 'Monthly recurring revenue', value: 'KES 684K', note: '+11.2% this month' }, { icon: 'building', label: 'Paid organizations', value: '26', note: 'Across 4 plans' }, { icon: 'clock', label: 'Trials', value: '12', note: '5 ending this week' }, { icon: 'alert', label: 'Payment failures', value: '3', note: 'KES 28,500 at risk', tone: 'red' }] },
  'owner:Reports': { eyebrow: 'Portfolio intelligence', title: 'Reports & analytics', subtitle: 'Turn occupancy, rent, bookings, costs and service performance into clear decisions.', action: 'Build custom report', icon: 'chart', stats: [{ icon: 'chart', label: 'Saved reports', value: '14', note: '6 scheduled automatically' }, { icon: 'wallet', label: 'Revenue growth', value: '+8.4%', note: 'Month on month' }, { icon: 'home', label: 'Occupancy', value: '91%', note: '+3.2% this quarter' }, { icon: 'tool', label: 'Cost per unit', value: 'KES 7.5K', note: '-4.8% this quarter' }] },
  'admin:Analytics': { eyebrow: 'Platform intelligence', title: 'Analytics', subtitle: 'Measure growth, engagement, marketplace quality, revenue and system adoption across every role.', action: 'Create dashboard', icon: 'chart', stats: [{ icon: 'users', label: 'Monthly active users', value: '1,248', note: '+18.6% this month' }, { icon: 'building', label: 'Organizations', value: '38', note: '+7 this month' }, { icon: 'wallet', label: 'Gross platform value', value: 'KES 14.8M', note: '+15.4% month on month' }, { icon: 'message', label: 'SMS delivered', value: '98.7%', note: '12,408 this month' }] },
}

const messagesByRole: Record<Role, Array<{ name: string; context: string; preview: string; time: string; unread?: number; avatar: string }>> = {
  owner: [
    { name: 'Amina Hassan', context: 'Marina Bay · A5G', preview: 'The provider has confirmed the 2:30 PM visit.', time: '10:58 AM', unread: 2, avatar: 'AH' },
    { name: 'DenzeK Services', context: 'REQ-2388 · Moving service', preview: 'We have uploaded the final quotation.', time: '9:44 AM', unread: 1, avatar: 'DS' },
    { name: 'Grace Wanjiku', context: 'Kilimani Heights manager', preview: 'Three move-in inspections are ready.', time: 'Yesterday', avatar: 'GW' },
    { name: 'Sarah Ahura', context: 'Booking BNB-2048', preview: 'Is an airport transfer available?', time: 'Yesterday', avatar: 'SA' },
  ],
  tenant: [
    { name: 'Marina Bay Facility Team', context: 'General support', preview: 'Your request has been assigned to DenzeK Services.', time: '10:58 AM', unread: 2, avatar: 'MB' },
    { name: 'DenzeK Services', context: 'REQ-2388', preview: 'We will arrive between 2:30 and 3:30 PM.', time: '10:32 AM', avatar: 'DS' },
    { name: 'Security Desk', context: 'Visitor access', preview: 'Your visitor pass is ready to share.', time: 'Yesterday', avatar: 'SD' },
  ],
  provider: [
    { name: 'Marina Property Group', context: 'JOB-818 · Moving service', preview: 'Access code and loading bay details attached.', time: '11:04 AM', unread: 2, avatar: 'MP' },
    { name: 'Amina Hassan', context: 'Tenant · Apartment A5G', preview: 'Please call when you reach the main gate.', time: '10:48 AM', avatar: 'AH' },
    { name: 'Kilimani Heights', context: 'JOB-822', preview: 'The client has confirmed the 4:15 PM slot.', time: '9:18 AM', avatar: 'KH' },
  ],
  guest: [
    { name: 'Elegant & Stylish Apartment', context: 'Booking BNB-2048', preview: 'We look forward to welcoming you on 28 August.', time: 'Yesterday', unread: 1, avatar: 'ES' },
    { name: 'MongaLets Guest Support', context: 'Booking assistance', preview: 'Your payment and receipt have been confirmed.', time: '27 Jul', avatar: 'ML' },
  ],
  admin: [
    { name: 'Marina Property Group', context: 'Organization support', preview: 'We need help configuring staff permissions.', time: '11:02 AM', unread: 2, avatar: 'MP' },
    { name: 'FikraWorks BulkSMS', context: 'Integration operations', preview: 'Delivery receipts are now flowing normally.', time: '10:35 AM', avatar: 'FW' },
    { name: 'AquaFix Plumbing', context: 'Verification VER-882', preview: 'The updated insurance certificate is attached.', time: '9:58 AM', unread: 1, avatar: 'AP' },
  ],
}

function Badge({ value }: { value: Cell }) {
  if (typeof value === 'string') return <>{value}</>
  return <span className={`data-badge data-badge--${value.tone}`}>{value.text}</span>
}

function Stats({ stats }: { stats: Stat[] }) {
  return <section className="workspace-stats">{stats.map((stat) => <article key={stat.label} className={stat.tone ? `workspace-stat workspace-stat--${stat.tone}` : 'workspace-stat'}><span><Icon name={stat.icon} size={19} /></span><div><small>{stat.label}</small><strong>{stat.value}</strong><p>{stat.note}</p></div></article>)}</section>
}

function PageHeader({ title, subtitle, eyebrow, action, icon, onAction }: { title: string; subtitle: string; eyebrow: string; action: string; icon: IconName; onAction: () => void }) {
  return <section className="workspace-page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div><div><button className="button button--secondary"><Icon name="filter" size={16} /> Filters</button><button className="button button--primary" onClick={onAction}><Icon name={icon} size={17} /> {action}</button></div></section>
}

function Toolbar({ placeholder = 'Search this workspace...' }: { placeholder?: string }) {
  return <div className="workspace-toolbar"><label><Icon name="search" size={17} /><input aria-label={placeholder} placeholder={placeholder} /></label><div><button className="filter-button"><Icon name="filter" size={14} /> All filters</button><button className="filter-button">Newest first <Icon name="chevron-down" size={14} /></button><button className="icon-button icon-button--soft" aria-label="Grid view"><Icon name="grid" size={17} /></button></div></div>
}

function CollectionPage({ config, onAction, onInspect }: { config: CollectionConfig; onAction: () => void; onInspect: (title: string, meta?: string) => void }) {
  return <>
    <PageHeader {...config} icon={config.actionIcon} onAction={onAction} />
    <Stats stats={config.stats} />
    {config.cards && <section className="portal-card workspace-card-section"><div className="portal-card__header"><div><small>Visual portfolio</small><h3>{config.cardTitle}</h3></div><button className="text-button text-button--accent">See map <Icon name="arrow-right" size={14} /></button></div><div className="property-management-grid">{config.cards.map((card) => <button key={card.title} className="management-property-card" onClick={() => onInspect(card.title, card.subtitle)}><div className="management-property-card__media">{card.image ? <img src={card.image} alt="" /> : <span><Icon name={card.icon ?? 'building'} size={25} /></span>}<i className={`data-badge data-badge--${card.statusTone}`}>{card.status}</i></div><div className="management-property-card__body"><h3>{card.title}</h3><p>{card.subtitle}</p>{card.progress !== undefined && <div className="occupancy-progress"><span style={{ width: `${card.progress}%` }} /></div>}<ul>{card.meta.map((item) => <li key={item}>{item}</li>)}</ul></div></button>)}</div></section>}
    <section className="portal-card workspace-table-card"><Toolbar placeholder={`Search ${config.title.toLowerCase()}...`} /><div className="responsive-table"><table><thead><tr>{config.columns.map((column) => <th key={column}>{column}</th>)}<th aria-label="Actions" /></tr></thead><tbody>{config.rows.map((row) => <tr key={row.id} onClick={() => onInspect(String(typeof row.cells[0] === 'string' ? row.cells[0] : row.cells[0].text), row.id)}>{row.cells.map((cell, index) => <td key={`${row.id}-${index}`}><Badge value={cell} /></td>)}<td><button className="table-action" aria-label={`Open ${row.id}`}><Icon name="arrow-right" size={15} /></button></td></tr>)}</tbody></table></div><div className="table-footer"><span>Showing {config.rows.length} records</span><div><button disabled>Previous</button><button className="is-current">1</button><button>2</button><button>Next</button></div></div></section>
  </>
}

function BoardPage({ config, onAction, onInspect }: { config: BoardConfig; onAction: () => void; onInspect: (title: string, meta?: string) => void }) {
  return <>
    <PageHeader {...config} icon={config.actionIcon} onAction={onAction} />
    <Stats stats={config.stats} />
    <Toolbar placeholder="Search requests, jobs or quotations..." />
    <section className="kanban-board">{config.lanes.map((lane) => <div className="kanban-lane" key={lane.title}><header><div><span className={`lane-dot lane-dot--${lane.tone}`} /><strong>{lane.title}</strong></div><b>{lane.count}</b></header><div className="kanban-lane__body">{lane.cards.map((card) => <button className="kanban-card" key={card.id} onClick={() => onInspect(card.title, card.id)}><div className="kanban-card__top"><small>{card.id}</small>{card.priority && <span className="data-badge data-badge--red">{card.priority}</span>}</div><h3>{card.title}</h3><strong>{card.subtitle}</strong><p>{card.details}</p><footer><span><Icon name="clock" size={13} /> {card.time}</span>{card.amount && <b>{card.amount}</b>}</footer></button>)}</div><button className="kanban-add"><Icon name="plus" size={15} /> Add item</button></div>)}</section>
  </>
}

const calendarDays = Array.from({ length: 35 }, (_, index) => index - 2)
const calendarEvents: Record<string, Array<{ day: number; title: string; tone: BadgeTone; time: string }>> = {
  owner: [{ day: 2, title: 'Rent collection', tone: 'green', time: 'All day' }, { day: 4, title: 'Move-in support · A5G', tone: 'blue', time: '2:30 PM' }, { day: 6, title: '3 guest arrivals', tone: 'dark', time: 'From 3 PM' }, { day: 8, title: 'Inspection · House 12', tone: 'amber', time: '10:00 AM' }, { day: 12, title: 'Provider payment run', tone: 'green', time: '9:00 AM' }, { day: 18, title: 'Organization renewal', tone: 'red', time: 'All day' }],
  tenant: [{ day: 4, title: 'DenzeK visit', tone: 'blue', time: '2:30 PM' }, { day: 6, title: 'Visitor · Mary', tone: 'green', time: '10:00 AM' }, { day: 10, title: 'Amenity booking', tone: 'dark', time: '4:00 PM' }, { day: 18, title: 'Community meeting', tone: 'amber', time: '6:00 PM' }],
  provider: [{ day: 4, title: '3 field jobs', tone: 'blue', time: 'From 2:30 PM' }, { day: 5, title: 'Office relocation', tone: 'dark', time: '8:00 AM' }, { day: 8, title: 'Team safety briefing', tone: 'amber', time: '7:30 AM' }, { day: 12, title: 'Payout cycle', tone: 'green', time: 'All day' }, { day: 15, title: 'Availability blocked', tone: 'red', time: 'Afternoon' }],
}

function CalendarPage({ role, meta, onAction }: { role: 'owner' | 'tenant' | 'provider'; meta: typeof pageMeta[string]; onAction: () => void }) {
  const events = calendarEvents[role]
  return <>
    <PageHeader {...meta} onAction={onAction} />
    <Stats stats={meta.stats} />
    <section className="calendar-layout"><div className="portal-card calendar-main"><header><div><button className="icon-button icon-button--soft"><Icon name="arrow-right" size={16} style={{ transform: 'rotate(180deg)' }} /></button><h3>August 2026</h3><button className="icon-button icon-button--soft"><Icon name="arrow-right" size={16} /></button></div><div><button className="filter-button is-active">Month</button><button className="filter-button">Week</button><button className="filter-button">Agenda</button></div></header><div className="calendar-weekdays">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{calendarDays.map((day, index) => { const date = day <= 0 ? day + 31 : day; const outside = day <= 0 || day > 31; const dayEvents = outside ? [] : events.filter((event) => event.day === day); return <button key={index} className={`${outside ? 'is-outside' : ''} ${day === 4 ? 'is-today' : ''}`}><strong>{date}</strong>{dayEvents.map((event) => <span key={event.title} className={`calendar-event calendar-event--${event.tone}`}><b>{event.time}</b>{event.title}</span>)}</button> })}</div></div><aside className="portal-card calendar-agenda"><div className="portal-card__header"><div><small>Selected day</small><h3>Tuesday, 4 August</h3></div><span className="pill">Today</span></div><div className="agenda-list">{events.slice(0,4).map((event, index) => <article key={event.title}><time>{event.day === 4 ? event.time : `${event.day} Aug`}</time><span className={`lane-dot lane-dot--${event.tone}`} /><div><strong>{event.title}</strong><small>{index % 2 === 0 ? 'Marina Bay Apartments' : 'Assigned and confirmed'}</small></div></article>)}</div><button className="button button--secondary button--full">Open full agenda</button></aside></section>
  </>
}

function FinancePage({ meta, role, onAction, onInspect }: { meta: typeof pageMeta[string]; role: Role; onAction: () => void; onInspect: (title: string, meta?: string) => void }) {
  const rows: Row[] = role === 'owner' ? [
    { id: 'TX-8001', cells: ['Rent payment · A5G', 'Marina Bay', 'Income', '4 Aug 2026', 'M-Pesa', 'KES 28,000', { text: 'Reconciled', tone: 'green' }] },
    { id: 'TX-8002', cells: ['Plumbing materials', 'Spring Valley', 'Expense', '4 Aug 2026', 'Bank', 'KES 18,500', { text: 'Approval due', tone: 'amber' }] },
    { id: 'TX-8003', cells: ['Booking · Suite 06', 'Coastal Haven', 'Income', '3 Aug 2026', 'Card', 'KES 17,600', { text: 'Settled', tone: 'green' }] },
    { id: 'TX-8004', cells: ['Cleaning services', 'Kilimani Heights', 'Expense', '2 Aug 2026', 'M-Pesa', 'KES 8,500', { text: 'Paid', tone: 'green' }] },
  ] : role === 'tenant' ? [
    { id: 'PAY-501', cells: ['August 2026 rent', 'Rent', '1 Aug 2026', 'M-Pesa', 'QH81BX29KP', 'KES 28,000', { text: 'Paid', tone: 'green' }] },
    { id: 'PAY-499', cells: ['July 2026 rent', 'Rent', '1 Jul 2026', 'M-Pesa', 'QG72LX48MA', 'KES 28,000', { text: 'Paid', tone: 'green' }] },
    { id: 'PAY-488', cells: ['Water adjustment', 'Utility', '16 Jun 2026', 'Account credit', 'CR-2260', 'KES 650', { text: 'Applied', tone: 'blue' }] },
    { id: 'PAY-472', cells: ['June 2026 rent', 'Rent', '1 Jun 2026', 'Bank transfer', 'MB-448201', 'KES 28,000', { text: 'Paid', tone: 'green' }] },
  ] : role === 'provider' ? [
    { id: 'ERN-818', cells: ['JOB-818 · Move-in support', 'Marina Bay', '4 Aug 2026', 'Gross', 'KES 20,000', 'KES 1,000', { text: 'In progress', tone: 'blue' }] },
    { id: 'ERN-799', cells: ['JOB-799 · Appliance relocation', 'Spring Valley', '3 Aug 2026', 'Net', 'KES 12,000', 'KES 600', { text: 'Pending confirmation', tone: 'amber' }] },
    { id: 'ERN-792', cells: ['JOB-792 · Move-out support', 'Marina Bay', '2 Aug 2026', 'Net', 'KES 15,500', 'KES 775', { text: 'Ready for payout', tone: 'green' }] },
    { id: 'ERN-784', cells: ['JOB-784 · Office relocation', 'Westlands', '30 Jul 2026', 'Net', 'KES 45,000', 'KES 2,250', { text: 'Paid', tone: 'green' }] },
  ] : role === 'guest' ? [
    { id: 'RCPT-001', cells: ['Accommodation · 2 nights', '28–30 Aug 2026', 'KES 8,000 × 2', 'KES 16,000', { text: 'Paid', tone: 'green' }] },
    { id: 'RCPT-002', cells: ['Accommodation tax', '10%', 'KES 1,600', 'KES 1,600', { text: 'Included', tone: 'blue' }] },
    { id: 'RCPT-003', cells: ['Total booking', 'Invoice 27 Jul 2026', '—', 'KES 17,600', { text: 'Paid', tone: 'green' }] },
  ] : [
    { id: 'SUB-100', cells: ['Marina Property Group', 'Portfolio Pro', 'Monthly', '18 Aug 2026', 'Card', 'KES 42,000', { text: 'Active', tone: 'green' }] },
    { id: 'SUB-101', cells: ['Kilele Facility Managers', 'Enterprise', 'Annual', '1 Sep 2026', 'Bank', 'KES 1,020,000', { text: 'Active', tone: 'green' }] },
    { id: 'SUB-102', cells: ['Coastal Haven Stays', 'Stay Plus', 'Trial', '12 Aug 2026', 'Not added', 'KES 18,500', { text: 'Trial', tone: 'blue' }] },
    { id: 'SUB-103', cells: ['Oakline Apartments', 'Starter', 'Monthly', 'Overdue', 'M-Pesa', 'KES 7,500', { text: 'Payment failed', tone: 'red' }] },
  ]
  const columns = role === 'guest' ? ['Charge', 'Period', 'Calculation', 'Amount', 'Status'] : role === 'provider' ? ['Description', 'Client', 'Date', 'Basis', 'Amount', 'Fee', 'Status'] : role === 'tenant' ? ['Description', 'Type', 'Date', 'Method', 'Reference', 'Amount', 'Status'] : ['Description', 'Property / account', 'Type / plan', 'Date / renewal', 'Method', 'Amount', 'Status']
  return <>
    <PageHeader {...meta} onAction={onAction} />
    <Stats stats={meta.stats} />
    <section className="finance-layout"><div className="portal-card finance-chart-card"><div className="portal-card__header"><div><small>Performance</small><h3>{role === 'tenant' || role === 'guest' ? 'Payment history' : role === 'provider' ? 'Earnings trend' : role === 'admin' ? 'Recurring revenue' : 'Income versus expenses'}</h3></div><button className="filter-button">Last 6 months <Icon name="chevron-down" size={14} /></button></div><div className="bar-chart"><div className="bar-chart__plot">{[44,58,51,71,66,84].map((height, index) => <div key={index}><i style={{ height: `${Math.max(height - 18, 20)}%` }} /><b style={{ height: `${height}%` }} /></div>)}</div><div className="bar-chart__labels">{['Mar','Apr','May','Jun','Jul','Aug'].map((month) => <span key={month}>{month}</span>)}</div><footer><span><i className="legend-dot legend-dot--soft" /> Expected / previous</span><span><i className="legend-dot" /> Actual / current</span></footer></div></div><aside className="portal-card finance-breakdown"><div className="portal-card__header"><div><small>Distribution</small><h3>{role === 'owner' ? 'Income by property' : role === 'admin' ? 'Plans by revenue' : role === 'provider' ? 'Earnings by service' : 'Account summary'}</h3></div></div><div className="donut-wrap"><div className="donut-chart"><span><strong>{role === 'owner' ? '82%' : role === 'provider' ? '68%' : role === 'admin' ? '74%' : '100%'}</strong><small>{role === 'guest' ? 'paid' : 'healthy'}</small></span></div><ul><li><i /><span>Primary category</span><b>52%</b></li><li><i /><span>Secondary category</span><b>30%</b></li><li><i /><span>Other</span><b>18%</b></li></ul></div></aside></section>
    <section className="portal-card workspace-table-card"><Toolbar placeholder="Search transactions and references..." /><div className="responsive-table"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}<th /></tr></thead><tbody>{rows.map((row) => <tr key={row.id} onClick={() => onInspect(typeof row.cells[0] === 'string' ? row.cells[0] : row.cells[0].text, row.id)}>{row.cells.map((cell, index) => <td key={index}><Badge value={cell} /></td>)}<td><button className="table-action"><Icon name="arrow-right" size={15} /></button></td></tr>)}</tbody></table></div></section>
  </>
}

function MessagesPage({ role, onAction }: { role: Role; onAction: (message?: string) => void }) {
  const conversations = messagesByRole[role]
  const [active, setActive] = useState(0)
  const [draft, setDraft] = useState('')
  const current = conversations[active]
  return <>
    <PageHeader eyebrow="Communication centre" title={role === 'guest' ? 'Message host' : 'Messages'} subtitle="Keep every conversation connected to the right property, booking, request or job." action="New message" icon="message" onAction={() => onAction()} />
    <section className="message-workspace"><aside className="portal-card message-list"><header><label><Icon name="search" size={16} /><input placeholder="Search conversations..." /></label><button className="icon-button icon-button--soft"><Icon name="filter" size={16} /></button></header><div>{conversations.map((conversation, index) => <button key={conversation.name} className={active === index ? 'is-active' : ''} onClick={() => setActive(index)}><span>{conversation.avatar}</span><section><div><strong>{conversation.name}</strong><time>{conversation.time}</time></div><small>{conversation.context}</small><p>{conversation.preview}</p></section>{conversation.unread && <b>{conversation.unread}</b>}</button>)}</div></aside><main className="portal-card message-thread"><header><div><span>{current.avatar}</span><section><strong>{current.name}</strong><small>{current.context} · Online recently</small></section></div><div><button className="icon-button icon-button--soft"><Icon name="phone" size={17} /></button><button className="icon-button icon-button--soft"><Icon name="clipboard" size={17} /></button></div></header><div className="message-thread__body"><div className="message-date">Today</div><article className="message-bubble"><p>Hello, we are following up on the latest update connected to this workspace.</p><small>10:32 AM</small></article><article className="message-bubble message-bubble--mine"><p>{current.preview}</p><small>{current.time} · Delivered</small></article><div className="message-system"><Icon name="sync" size={14} /> This conversation is synchronized with the related record timeline.</div><article className="message-bubble"><p>Thank you. I have received the update and will let you know if anything changes.</p><small>10:58 AM</small></article></div><footer><button className="icon-button icon-button--soft"><Icon name="plus" size={18} /></button><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a secure message..." /><button className="button button--primary button--small" onClick={() => { if (draft.trim()) { onAction('Message sent and synchronized.'); setDraft('') } }}><Icon name="arrow-right" size={16} /> Send</button></footer></main><aside className="portal-card message-context"><div className="portal-card__header"><div><small>Linked context</small><h3>{current.context}</h3></div></div><div className="context-summary"><span><Icon name={role === 'guest' ? 'key' : role === 'provider' ? 'tool' : role === 'admin' ? 'shield' : 'home'} size={22} /></span><strong>{role === 'guest' ? 'Upcoming stay' : role === 'provider' ? 'Active job' : role === 'admin' ? 'Support record' : 'Property workspace'}</strong><p>Every attachment, decision and update is retained in the audit trail.</p><button className="button button--secondary button--full">Open linked record</button></div><div className="context-files"><strong>Shared files</strong><button><Icon name="clipboard" size={16} /><span>Latest summary.pdf</span><small>1.2 MB</small></button><button><Icon name="camera" size={16} /><span>Site photos</span><small>6 files</small></button></div></aside></section>
  </>
}

function ReportsPage({ role, meta, onAction }: { role: 'owner' | 'admin'; meta: typeof pageMeta[string]; onAction: () => void }) {
  const reportCards = role === 'owner' ? [
    ['Occupancy & vacancy', 'Portfolio occupancy, vacancy days and listing readiness.', 'home', 'Updated 8 min ago'],
    ['Rent collection', 'Expected, collected, overdue and recovery performance.', 'wallet', 'Scheduled monthly'],
    ['Property profitability', 'Income, expenses and net operating income per property.', 'chart', 'Updated today'],
    ['Maintenance performance', 'Request volume, cost, response time and provider quality.', 'tool', 'Updated 21 min ago'],
    ['Short-stay performance', 'Bookings, occupancy, average nightly rate and guest sources.', 'key', 'Updated hourly'],
    ['Tenant lifecycle', 'Move-ins, renewals, notices, deposits and move-outs.', 'users', 'Updated daily'],
  ] : [
    ['Growth & adoption', 'Organizations, users, role activation and retention.', 'users', 'Live'],
    ['Marketplace health', 'Provider supply, demand, completion and dispute quality.', 'briefcase', 'Updated hourly'],
    ['Revenue intelligence', 'Subscriptions, marketplace value and communication revenue.', 'wallet', 'Updated 6 min ago'],
    ['Communication delivery', 'FikraWorks BulkSMS volume, delivery and failure analysis.', 'message', 'Live'],
    ['Risk & integrity', 'Access anomalies, verification and data-quality trends.', 'shield', 'Updated 12 min ago'],
    ['Platform performance', 'Sessions, response times, errors and synchronization health.', 'sync', 'Live'],
  ]
  return <>
    <PageHeader {...meta} onAction={onAction} />
    <Stats stats={meta.stats} />
    <section className="analytics-hero portal-card"><div><small>Executive view</small><h3>{role === 'owner' ? 'Portfolio income and occupancy are both trending upward.' : 'Platform adoption and recurring revenue accelerated this month.'}</h3><p>{role === 'owner' ? 'Revenue is 8.4% above July while maintenance cost per occupied unit is down 4.8%.' : 'Monthly active users grew 18.6%, with owner onboarding completion improving across trial accounts.'}</p><div><span><i /> Current period</span><span><i /> Previous period</span></div></div><svg viewBox="0 0 700 230" preserveAspectRatio="none"><defs><linearGradient id="reportArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1c8f82" stopOpacity=".32"/><stop offset="1" stopColor="#1c8f82" stopOpacity="0"/></linearGradient></defs><path d="M0 185 C80 160 95 170 150 136 S245 120 310 102 S405 114 470 72 S590 85 700 34 V230 H0Z" fill="url(#reportArea)"/><path d="M0 185 C80 160 95 170 150 136 S245 120 310 102 S405 114 470 72 S590 85 700 34" fill="none" stroke="#147b70" strokeWidth="5"/><path d="M0 202 C80 191 110 183 160 171 S250 156 320 145 S430 132 510 112 S620 100 700 82" fill="none" stroke="#aac5bf" strokeWidth="4" strokeDasharray="9 9"/></svg></section>
    <section className="report-card-grid">{reportCards.map(([title, text, icon, update]) => <button key={title} className="portal-card"><span><Icon name={icon as IconName} size={21} /></span><div><h3>{title}</h3><p>{text}</p><small>{update}</small></div><Icon name="arrow-right" size={17} /></button>)}</section>
  </>
}

function SettingsPage({ role, page, onAction }: { role: Role; page: string; onAction: (message?: string) => void }) {
  const profile = role === 'tenant' || role === 'guest' || role === 'provider'
  const title = page
  const subtitle = role === 'owner' ? 'Configure portfolio defaults, team access, notifications, billing and integrations.' : role === 'admin' ? 'Control platform rules, security, integrations, plans and operational safeguards.' : profile ? 'Keep identity, contact, preferences, security and communication details current.' : 'Manage workspace preferences.'
  const sections = role === 'owner' ? [
    ['Organization profile', 'Business identity, contacts and legal information', 'building'], ['Team & permissions', 'Roles, property access and approval limits', 'users'], ['Payment methods', 'Collections, payouts and reconciliation preferences', 'wallet'], ['FikraWorks BulkSMS', 'Sender ID, credits, templates and automation', 'message'], ['Integrations', 'M-Pesa, email, accounting, maps and storage', 'sync'], ['Security & audit', 'Multi-factor authentication, sessions and logs', 'shield'],
  ] : role === 'admin' ? [
    ['Platform identity', 'Brand, domains, support channels and legal settings', 'building'], ['Role & permission engine', 'System roles, scopes and elevated access', 'users'], ['Authentication & security', 'MFA, sessions, password and risk rules', 'shield'], ['Billing configuration', 'Plans, taxes, currencies and collection methods', 'wallet'], ['FikraWorks integrations', 'BulkSMS, ReviewsPro, Ask Fundi and APIs', 'sync'], ['Operational controls', 'SLA, automation, audit and data retention', 'settings'],
  ] : role === 'provider' ? [
    ['Business details', 'Name, registration, contacts and coverage areas', 'briefcase'], ['Services & pricing', 'Categories, call-out fees and reusable quotation items', 'tool'], ['Verification documents', 'Identity, licence, insurance and certificates', 'shield'], ['Availability', 'Working hours, travel radius and blocked dates', 'calendar'], ['Payout details', 'M-Pesa, bank account and payout preferences', 'wallet'], ['Security', 'Password, one-time password and active sessions', 'lock'],
  ] : role === 'tenant' ? [
    ['Personal details', 'Name, identification and contact information', 'users'], ['Communication preferences', 'SMS, email, push and emergency alerts', 'bell'], ['Security', 'Password, login methods and active sessions', 'lock'], ['Household members', 'People connected to your home and access', 'home'], ['Accessibility', 'Language, text size and assistance preferences', 'settings'], ['Privacy & data', 'Consent, download and account controls', 'shield'],
  ] : [
    ['Guest identity', 'Name, phone, email and verification details', 'users'], ['Arrival preferences', 'Expected time, transport and accessibility', 'key'], ['Communication', 'SMS, email and host contact preferences', 'message'], ['Saved travellers', 'People commonly included in your bookings', 'users'], ['Security', 'Booking access, one-time password and sessions', 'lock'], ['Privacy', 'Consent, document retention and data controls', 'shield'],
  ]
  return <>
    <PageHeader eyebrow={profile ? 'Account' : 'Configuration'} title={title} subtitle={subtitle} action="Save changes" icon="check" onAction={() => onAction('Changes saved successfully.')} />
    <section className="settings-layout"><aside className="portal-card settings-nav">{sections.map(([name, description, icon], index) => <button key={name} className={index === 0 ? 'is-active' : ''}><span><Icon name={icon as IconName} size={18} /></span><div><strong>{name}</strong><small>{description}</small></div><Icon name="arrow-right" size={15} /></button>)}</aside><main className="portal-card settings-form"><div className="settings-form__header"><span>{profile ? (role === 'provider' ? 'DS' : role === 'tenant' ? 'AH' : 'SA') : role === 'admin' ? 'ML' : 'MP'}</span><div><h3>{role === 'provider' ? 'DenzeK Services' : role === 'tenant' ? 'Amina Hassan' : role === 'guest' ? 'Sarah Ahura' : role === 'admin' ? 'MongaLets Platform' : 'Marina Property Group'}</h3><p>{sections[0][1]}</p></div><button className="button button--secondary button--small">Change photo</button></div><div className="settings-form__grid"><label><span>{profile ? 'Full name / business name' : 'Workspace name'}</span><input defaultValue={role === 'provider' ? 'DenzeK Services' : role === 'tenant' ? 'Amina Hassan' : role === 'guest' ? 'Sarah Ahura' : role === 'admin' ? 'MongaLets' : 'Marina Property Group'} /></label><label><span>Primary email</span><input defaultValue={role === 'admin' ? 'platform@mongalets.co.ke' : role === 'provider' ? 'denzek@provider.demo' : role === 'tenant' ? 'amina@tenant.demo' : role === 'guest' ? 'sarah@guest.demo' : 'admin@marinaproperty.co.ke'} /></label><label><span>Phone number</span><input defaultValue="+254 769 778 549" /></label><label><span>Preferred language</span><select defaultValue="English"><option>English</option><option>Kiswahili</option></select></label><label className="settings-form__wide"><span>Address or location</span><input defaultValue={role === 'guest' ? 'Nairobi, Kenya' : 'Westlands, Nairobi, Kenya'} /></label><label className="settings-form__wide"><span>About / operational note</span><textarea defaultValue="Keep all updates clear, secure and synchronized across the MongaLets ecosystem." /></label></div><div className="settings-switches"><article><div><strong>FikraWorks BulkSMS notifications</strong><small>Receive important status, payment and security messages.</small></div><button className="switch is-on"><i /></button></article><article><div><strong>Real-time synchronization</strong><small>Keep this account current across devices and connected workspaces.</small></div><button className="switch is-on"><i /></button></article><article><div><strong>Product guidance</strong><small>Show useful tips and feature explanations where relevant.</small></div><button className="switch"><i /></button></article></div></main></section>
  </>
}

function AnnouncementPage({ onAction }: { onAction: () => void }) {
  const items = [
    { title: 'Water tank maintenance', date: 'Tomorrow · 10:00 AM–12:00 PM', type: 'Maintenance', tone: 'amber' as BadgeTone, text: 'Water supply may be interrupted while the main tank is serviced. Please store enough water for essential use.' },
    { title: 'August community meeting', date: '18 Aug · 6:00 PM', type: 'Community', tone: 'blue' as BadgeTone, text: 'Residents are invited to the courtyard meeting to discuss parking, security and common-area improvements.' },
    { title: 'Updated visitor process', date: 'Effective 1 Aug 2026', type: 'Security', tone: 'green' as BadgeTone, text: 'Visitor passes can now be generated from your portal and shared by SMS before arrival.' },
  ]
  return <><PageHeader eyebrow="Property communication" title="Announcements" subtitle="Important property updates, community notices, emergency information and resident guidance." action="Notification preferences" icon="bell" onAction={onAction} /><Stats stats={[{ icon: 'bell', label: 'Unread', value: '1', note: 'Important maintenance notice' }, { icon: 'calendar', label: 'This month', value: '4', note: 'Property and community updates' }, { icon: 'shield', label: 'Emergency alerts', value: '0', note: 'No active incidents' }, { icon: 'message', label: 'SMS enabled', value: 'Yes', note: 'FikraWorks BulkSMS' }]} /><section className="announcement-layout"><div className="announcement-feed">{items.map((item, index) => <article className="portal-card" key={item.title}><div><span className={`data-badge data-badge--${item.tone}`}>{item.type}</span>{index === 0 && <i>Unread</i>}</div><h2>{item.title}</h2><small><Icon name="calendar" size={14} /> {item.date}</small><p>{item.text}</p><footer><button className="text-button text-button--accent">Read full announcement <Icon name="arrow-right" size={14} /></button><span>Marina Bay Facility Team</span></footer></article>)}</div><aside className="portal-card announcement-side"><div className="portal-card__header"><div><small>Property contacts</small><h3>Need immediate help?</h3></div></div><div><button><span><Icon name="shield" size={18} /></span><div><strong>Security desk</strong><small>Available 24 hours</small></div><Icon name="phone" size={16} /></button><button><span><Icon name="tool" size={18} /></span><div><strong>Facility team</strong><small>7:00 AM–8:00 PM</small></div><Icon name="message" size={16} /></button><button><span><Icon name="alert" size={18} /></span><div><strong>Emergency services</strong><small>For urgent safety incidents</small></div><Icon name="phone" size={16} /></button></div></aside></section></>
}

function JobMapPage({ onAction }: { onAction: () => void }) {
  return <><PageHeader eyebrow="Route intelligence" title="Job map" subtitle="See today’s stops, travel time, access notes and route risks before leaving for the field." action="Optimize route" icon="map" onAction={onAction} /><Stats stats={[{ icon: 'map', label: 'Today’s stops', value: '3', note: '27.4 km total route' }, { icon: 'clock', label: 'Travel time', value: '1h 18m', note: 'Current traffic estimate' }, { icon: 'wallet', label: 'Route value', value: 'KES 36.5K', note: 'Three confirmed jobs' }, { icon: 'alert', label: 'Route alerts', value: '1', note: 'Heavy traffic on Waiyaki Way', tone: 'amber' }]} /><section className="map-workspace"><div className="portal-card map-canvas"><div className="map-grid-lines" /><span className="map-road map-road--one" /><span className="map-road map-road--two" /><span className="map-road map-road--three" /><div className="map-marker map-marker--one"><b>1</b><span>Marina Bay<br/><small>2:30 PM</small></span></div><div className="map-marker map-marker--two"><b>2</b><span>Kilimani Heights<br/><small>4:15 PM</small></span></div><div className="map-marker map-marker--three"><b>3</b><span>Spring Valley<br/><small>6:00 PM</small></span></div><div className="map-current"><i /><span>Your location</span></div><div className="map-controls"><button className="icon-button icon-button--bordered">+</button><button className="icon-button icon-button--bordered">−</button></div></div><aside className="portal-card route-panel"><div className="portal-card__header"><div><small>Optimized sequence</small><h3>Today’s route</h3></div><span className="pill">On time</span></div><div className="route-stop-list">{[['2:30 PM','Move-in support','Marina Bay · 7.4 km','20 min'],['4:15 PM','Electrical inspection','Kilimani · 8.8 km','27 min'],['6:00 PM','Quotation visit','Spring Valley · 11.2 km','31 min']].map(([time,title,place,travel], index) => <article key={title}><b>{index + 1}</b><div><time>{time}</time><strong>{title}</strong><small>{place}</small><span><Icon name="clock" size={12} /> {travel} travel</span></div><button className="icon-button icon-button--soft"><Icon name="arrow-right" size={15} /></button></article>)}</div><button className="button button--primary button--full"><Icon name="map" size={16} /> Start navigation</button></aside></section></>
}

function CheckInPage({ onAction }: { onAction: (message?: string) => void }) {
  const [completed, setCompleted] = useState([true, true, false, false])
  const steps = [
    ['Guest details confirmed', 'Name, phone and identification are complete.'],
    ['Payment confirmed', 'KES 17,600 received and receipt issued.'],
    ['Arrival information', 'Tell the host your expected arrival time.'],
    ['Digital access', 'Your secure code is issued 24 hours before arrival.'],
  ]
  return <><PageHeader eyebrow="Arrival experience" title="Prepare for check-in" subtitle="Complete the remaining details now for a smooth, secure and contactless arrival." action="Contact host" icon="message" onAction={() => onAction()} /><section className="checkin-hero portal-card"><div className="checkin-hero__image"><img src="/assets/property-coast.svg" alt="Elegant and Stylish Apartment" /><span className="data-badge data-badge--green">Booking confirmed</span></div><div><small>Booking BNB-2048</small><h2>Elegant & Stylish Apartment</h2><p>Marina Bay · Building A · Fifth floor</p><div className="checkin-dates"><span><small>Check-in</small><strong>28 Aug · 3:00 PM</strong></span><i /><span><small>Check-out</small><strong>30 Aug · 11:00 AM</strong></span></div><div className="checkin-progress"><span><i style={{ width: `${completed.filter(Boolean).length * 25}%` }} /></span><small>{completed.filter(Boolean).length} of 4 steps complete</small></div></div></section><section className="checkin-layout"><main className="portal-card checkin-steps"><div className="portal-card__header"><div><small>Pre-arrival checklist</small><h3>Everything needed for your stay</h3></div></div>{steps.map(([title,text], index) => <article key={title} className={completed[index] ? 'is-complete' : ''}><button onClick={() => setCompleted((current) => current.map((value, position) => position === index ? !value : value))}><Icon name={completed[index] ? 'check' : 'clock'} size={16} /></button><div><strong>{title}</strong><p>{text}</p>{index === 2 && !completed[index] && <label><span>Expected arrival time</span><input type="time" defaultValue="15:30" /></label>}{index === 3 && <div className="access-preview"><Icon name="lock" size={18} /><span><strong>Access code protected</strong><small>Available 27 August at 3:00 PM</small></span></div>}</div><span className={`data-badge data-badge--${completed[index] ? 'green' : 'amber'}`}>{completed[index] ? 'Complete' : 'Action needed'}</span></article>)}<footer><button className="button button--primary" onClick={() => onAction('Check-in details saved and shared with the host.')}><Icon name="check" size={16} /> Save check-in details</button></footer></main><aside className="portal-card house-guide"><div className="portal-card__header"><div><small>Quick guide</small><h3>Before you arrive</h3></div></div><div>{[['map','Directions & parking','Open the property map and parking instructions.'],['key','Access & security','Your booking code is unique and time-limited.'],['sparkles','House preparation','The apartment is cleaned before every arrival.'],['phone','Host support','Message the host from your secure guest portal.']].map(([icon,title,text]) => <button key={title}><span><Icon name={icon as IconName} size={18} /></span><div><strong>{title}</strong><small>{text}</small></div><Icon name="arrow-right" size={15} /></button>)}</div></aside></section></>
}

function DirectionsPage({ onAction }: { onAction: () => void }) {
  return <><PageHeader eyebrow="Property location" title="Directions & arrival" subtitle="Navigate confidently with live location, landmarks, parking and building access instructions." action="Open navigation" icon="map" onAction={onAction} /><section className="direction-layout"><div className="portal-card map-canvas direction-map"><div className="map-grid-lines" /><span className="map-road map-road--one" /><span className="map-road map-road--two" /><span className="map-road map-road--three" /><div className="property-map-pin"><Icon name="home" size={22} /><span>Elegant & Stylish Apartment</span></div><div className="map-current"><i /><span>Your current area</span></div><div className="map-controls"><button className="icon-button icon-button--bordered">+</button><button className="icon-button icon-button--bordered">−</button></div></div><aside className="portal-card arrival-guide"><div className="portal-card__header"><div><small>Arrival guide</small><h3>Marina Bay · Building A</h3></div></div><div className="arrival-address"><span><Icon name="map" size={20} /></span><div><strong>Marina Bay Apartments</strong><p>Building A, Fifth Floor, Nairobi</p><button className="text-button text-button--accent">Copy address</button></div></div><ol><li><b>1</b><div><strong>Enter through the main gate</strong><p>Show your booking confirmation or use the guest code sent by SMS.</p></div></li><li><b>2</b><div><strong>Use visitor parking</strong><p>Bay A-12 is reserved from 2:30 PM on check-in day.</p></div></li><li><b>3</b><div><strong>Proceed to Building A</strong><p>Take the lift to Floor 5 and follow the signs to Apartment A5G.</p></div></li></ol><div className="arrival-note"><Icon name="alert" size={17} /><p>Call the host from the portal if the security desk needs additional confirmation.</p></div></aside></section></>
}

function GuestServicesPage({ onAction }: { onAction: (message?: string) => void }) {
  const services = [
    ['Airport transfer','Private pickup from JKIA or Wilson Airport.','From KES 2,500','map','Popular'],
    ['Extra cleaning','Refresh the apartment during your stay.','From KES 1,500','sparkles','Available'],
    ['Breakfast basket','Fresh local breakfast delivered to your door.','From KES 1,200','home','New'],
    ['Laundry service','Pickup, wash, fold and return.','From KES 800','briefcase','Same day'],
    ['Early check-in','Arrive before the standard 3:00 PM time.','Request availability','clock','Flexible'],
    ['Late checkout','Extend checkout beyond 11:00 AM.','Request availability','calendar','Flexible'],
  ]
  return <><PageHeader eyebrow="Enhance your stay" title="Guest services" subtitle="Add helpful, trusted services before or during your stay with transparent pricing." action="View my requests" icon="clipboard" onAction={() => onAction()} /><Stats stats={[{ icon: 'sparkles', label: 'Available services', value: '12', note: 'For this property' }, { icon: 'clock', label: 'Fastest confirmation', value: '5 min', note: 'During support hours' }, { icon: 'wallet', label: 'Current add-ons', value: 'KES 0', note: 'No services added yet' }, { icon: 'star', label: 'Service rating', value: '4.8', note: 'From recent guests' }]} /><section className="service-market-grid">{services.map(([title,text,price,icon,badge]) => <article className="portal-card" key={title}><span><Icon name={icon as IconName} size={23} /></span><i className="data-badge data-badge--blue">{badge}</i><h3>{title}</h3><p>{text}</p><strong>{price}</strong><button className="button button--secondary button--full" onClick={() => onAction(`${title} request started.`)}>Request service <Icon name="arrow-right" size={15} /></button></article>)}</section></>
}

function HelpRequestPage({ onAction }: { onAction: (message?: string) => void }) {
  const [category, setCategory] = useState('Maintenance')
  return <><PageHeader eyebrow="Guest support" title="Request help" subtitle="Tell the host or facility team what you need, add evidence and follow the response in real time." action="Emergency contact" icon="phone" onAction={() => onAction()} /><section className="help-layout"><main className="portal-card help-form"><div className="portal-card__header"><div><small>New guest request</small><h3>How can we help?</h3></div><span className="data-badge data-badge--green">Secure</span></div><div className="help-categories">{['Maintenance','Housekeeping','Access','Noise','Other'].map((item) => <button key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}><Icon name={item === 'Maintenance' ? 'tool' : item === 'Housekeeping' ? 'sparkles' : item === 'Access' ? 'key' : item === 'Noise' ? 'bell' : 'message'} size={18} /><span>{item}</span></button>)}</div><div className="form-stack"><label><span>What happened?</span><textarea placeholder="Describe what you need help with..." /></label><label><span>Where is it?</span><select><option>Inside the apartment</option><option>Building common area</option><option>Parking area</option><option>Property entrance</option></select></label><div className="upload-zone"><Icon name="camera" size={25} /><strong>Add photos or a short video</strong><small>Clear evidence helps the team respond faster.</small><button className="button button--secondary button--small">Choose files</button></div><label><span>Preferred response</span><select><option>Message me first</option><option>Call me</option><option>Provider may enter with host</option></select></label><button className="button button--primary button--full" onClick={() => onAction('Guest request submitted and synchronized with the host.')}><Icon name="arrow-right" size={16} /> Submit request</button></div></main><aside className="portal-card help-status"><div className="portal-card__header"><div><small>Existing request</small><h3>Air conditioner noise</h3></div><span className="data-badge data-badge--blue">In review</span></div><div className="request-timeline"><div className="is-done"><span><Icon name="check" size={12} /></span><div><strong>Request received</strong><small>Yesterday · 8:42 PM</small></div></div><div className="is-current"><span><Icon name="clock" size={12} /></span><div><strong>Host reviewing</strong><small>Update expected within 20 minutes</small></div></div><div><span /><div><strong>Resolution</strong><small>Next action will appear here</small></div></div></div></aside></section></>
}

function ReviewStayPage({ onAction }: { onAction: (message?: string) => void }) {
  const [rating, setRating] = useState(0)
  return <><PageHeader eyebrow="After your stay" title="Review your stay" subtitle="Your honest feedback helps hosts improve and gives future guests trustworthy guidance." action="View review policy" icon="shield" onAction={() => onAction()} /><section className="review-layout"><main className="portal-card review-form"><div className="review-property"><img src="/assets/property-coast.svg" alt="" /><div><small>Booking BNB-2048</small><h3>Elegant & Stylish Apartment</h3><p>28–30 August 2026 · Marina Bay</p></div></div><div className="rating-select"><small>Overall experience</small><div>{[1,2,3,4,5].map((star) => <button key={star} className={rating >= star ? 'is-active' : ''} onClick={() => setRating(star)}><Icon name="star" size={29} /></button>)}</div><strong>{rating === 0 ? 'Select a rating' : rating === 5 ? 'Exceptional' : rating >= 4 ? 'Very good' : rating >= 3 ? 'Good' : 'Needs improvement'}</strong></div><div className="review-aspects">{[['Cleanliness',5],['Communication',5],['Location',4],['Value',4]].map(([label,value]) => <label key={String(label)}><span>{label}</span><input type="range" min="1" max="5" defaultValue={String(value)} /><b>{value}.0</b></label>)}</div><label className="review-comment"><span>Share more about your experience</span><textarea placeholder="What stood out? What could be improved?" /></label><button className="button button--primary button--full" onClick={() => onAction('Thank you. Your review has been saved.')} disabled={!rating}><Icon name="star" size={16} /> Submit review</button></main><aside className="portal-card review-guidance"><span><Icon name="shield" size={24} /></span><h3>Trusted, useful reviews</h3><p>Reviews are connected to verified stays and published only after moderation checks.</p><ul><li><Icon name="check" size={14} /> Be specific and fair</li><li><Icon name="check" size={14} /> Avoid private information</li><li><Icon name="check" size={14} /> Focus on your direct experience</li></ul></aside></section></>
}

function BulkSMSPage({ onAction }: { onAction: (message?: string) => void }) {
  const [audience, setAudience] = useState('All active users')
  const [message, setMessage] = useState('')
  return <><PageHeader eyebrow="FikraWorks communication" title="BulkSMS centre" subtitle="Send secure, targeted and auditable SMS notifications across the MongaLets ecosystem." action="Buy SMS credits" icon="plus" onAction={() => onAction()} /><Stats stats={[{ icon: 'message', label: 'SMS balance', value: '48,620', note: 'Credits available' }, { icon: 'check', label: 'Delivery rate', value: '98.7%', note: '12,408 this month' }, { icon: 'clock', label: 'Average delivery', value: '5.8 sec', note: 'Across supported networks' }, { icon: 'alert', label: 'Failed today', value: '7', note: 'Automatic retry active', tone: 'amber' }]} /><section className="sms-workspace"><main className="portal-card sms-composer"><div className="portal-card__header"><div><small>New campaign</small><h3>Compose and send</h3></div><span className="data-badge data-badge--green">Sender ID: MONGALETS</span></div><div className="form-stack"><label><span>Audience</span><select value={audience} onChange={(event) => setAudience(event.target.value)}><option>All active users</option><option>All property owners</option><option>Tenants with overdue rent</option><option>Guests arriving tomorrow</option><option>Providers with active jobs</option><option>Custom segment</option></select></label><div className="audience-preview"><Icon name="users" size={19} /><div><strong>{audience}</strong><small>Estimated recipients: {audience === 'All active users' ? '1,248' : '128'}</small></div><button className="text-button text-button--accent">Preview</button></div><label><span>Message template</span><select><option>Write a custom message</option><option>Rent reminder</option><option>Booking confirmation</option><option>Provider appointment</option><option>Emergency notice</option></select></label><label><span>Message</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a clear SMS message..." maxLength={320} /><small>{message.length} / 320 characters · {message.length > 160 ? '2 SMS parts' : '1 SMS part'}</small></label><div className="sms-options"><label><input type="checkbox" defaultChecked /> <span>Include opt-out footer where required</span></label><label><input type="checkbox" /> <span>Schedule for later</span></label></div><button className="button button--primary button--full" onClick={() => { if (message.trim()) onAction(`SMS campaign queued for ${audience}.`) }}><Icon name="message" size={16} /> Review and send</button></div></main><aside className="portal-card sms-preview"><div className="phone-preview"><header><span>MONGALETS</span><small>Now</small></header><div><p>{message || 'Your MongaLets message preview will appear here as you type.'}</p><small>Delivered by FikraWorks BulkSMS</small></div></div><section><strong>Delivery safeguards</strong><p>Audience permissions, quiet hours, duplicate prevention and audit logging are applied before dispatch.</p><ul><li><Icon name="check" size={13} /> Recipient consent checked</li><li><Icon name="check" size={13} /> Duplicate numbers removed</li><li><Icon name="check" size={13} /> Delivery receipts recorded</li></ul></section></aside></section></>
}

function GenericActionModal({ open, title, role, page, onClose, onDone }: { open: boolean; title: string; role: Role; page: string; onClose: () => void; onDone: (message: string) => void }) {
  return <Modal open={open} onClose={onClose} title={title} eyebrow={`${page} · ${role}`} size="small"><form className="dashboard-modal-form" onSubmit={(event) => { event.preventDefault(); onDone(`${title} completed successfully.`) }}><div className="modal-form-intro"><span><Icon name="sparkles" size={21} /></span><div><strong>Connected workflow</strong><p>This demonstration action will be synchronized with the relevant timeline, notifications and audit history.</p></div></div><label><span>Title or reference</span><input required placeholder={`Enter ${title.toLowerCase()} details`} /></label><label><span>Related property or context</span><select><option>Marina Bay Apartments</option><option>Spring Valley Villas</option><option>Kilimani Heights</option><option>Coastal Haven Suites</option></select></label><label><span>Notes</span><textarea placeholder="Add any important details..." /></label><div className="dashboard-modal-form__row"><button type="button" className="button button--secondary" onClick={onClose}>Cancel</button><button type="submit" className="button button--primary"><Icon name="check" size={16} /> Save and continue</button></div></form></Modal>
}

function DetailModal({ open, title, meta, onClose }: { open: boolean; title: string; meta?: string; onClose: () => void }) {
  return <Modal open={open} onClose={onClose} title={title} eyebrow={meta ?? 'Record details'}><div className="record-detail"><div className="record-detail__hero"><span><Icon name="sync" size={24} /></span><div><small>Live synchronized record</small><h3>{title}</h3><p>Information shown here is connected to its property, people, finances, messages and audit history.</p></div><i className="data-badge data-badge--green">Active</i></div><section className="record-detail__stats"><article><small>Created</small><strong>4 Aug 2026</strong></article><article><small>Last update</small><strong>8 minutes ago</strong></article><article><small>Owner</small><strong>Assigned team</strong></article></section><div className="record-detail__tabs"><button className="is-active">Overview</button><button>Timeline</button><button>Files</button><button>Messages</button></div><div className="record-detail__timeline"><article><span><Icon name="check" size={13} /></span><div><strong>Record created and validated</strong><small>System · Today at 10:44 AM</small></div></article><article><span><Icon name="sync" size={13} /></span><div><strong>Related workspaces synchronized</strong><small>Notifications, finance and communication updated</small></div></article><article><span><Icon name="clock" size={13} /></span><div><strong>Next action pending</strong><small>Assigned user will receive a reminder automatically</small></div></article></div><footer><button className="button button--secondary">Open messages</button><button className="button button--primary">Open full record <Icon name="arrow-right" size={16} /></button></footer></div></Modal>
}

export function DashboardPage({ role, page }: { role: Role; page: string }) {
  const key = `${role}:${page}`
  const [actionOpen, setActionOpen] = useState(false)
  const [detail, setDetail] = useState<{ title: string; meta?: string } | null>(null)
  const [feedback, setFeedback] = useState('')

  const actionTitle = useMemo(() => {
    const collection = collectionConfigs[key]
    const board = boardConfigs[key]
    const meta = pageMeta[key]
    if (collection) return collection.action
    if (board) return board.action
    if (meta) return meta.action
    if (page === 'Announcements') return 'Notification preferences'
    if (page === 'Job map') return 'Optimize route'
    if (page === 'Check-in') return 'Contact host'
    if (page === 'Directions') return 'Open navigation'
    if (page === 'Guest services') return 'View requests'
    if (page === 'Request help') return 'Emergency contact'
    if (page === 'Review stay') return 'View review policy'
    if (page === 'BulkSMS') return 'Buy SMS credits'
    if (page.includes('Message') || page === 'Messages') return 'New message'
    return 'Save changes'
  }, [key, page])

  const showFeedback = (message = 'Action completed successfully.') => {
    setFeedback(message)
    window.setTimeout(() => setFeedback(''), 3200)
  }

  const onDone = (message: string) => {
    setActionOpen(false)
    showFeedback(message)
  }

  let content: React.ReactNode
  if (collectionConfigs[key]) content = <CollectionPage config={collectionConfigs[key]} onAction={() => setActionOpen(true)} onInspect={(title, meta) => setDetail({ title, meta })} />
  else if (boardConfigs[key]) content = <BoardPage config={boardConfigs[key]} onAction={() => setActionOpen(true)} onInspect={(title, meta) => setDetail({ title, meta })} />
  else if (page === 'Calendar' || page === 'Schedule') content = <CalendarPage role={role as 'owner' | 'tenant' | 'provider'} meta={pageMeta[key]} onAction={() => setActionOpen(true)} />
  else if (['Finances', 'Rent & payments', 'Earnings', 'Receipt', 'Subscriptions'].includes(page)) content = <FinancePage meta={pageMeta[key]} role={role} onAction={() => setActionOpen(true)} onInspect={(title, meta) => setDetail({ title, meta })} />
  else if (page === 'Messages' || page === 'Message host') content = <MessagesPage role={role} onAction={(message) => message ? showFeedback(message) : setActionOpen(true)} />
  else if (page === 'Reports' || page === 'Analytics') content = <ReportsPage role={role as 'owner' | 'admin'} meta={pageMeta[key]} onAction={() => setActionOpen(true)} />
  else if (['Settings', 'Profile', 'Business profile', 'Guest details', 'System settings'].includes(page)) content = <SettingsPage role={role} page={page} onAction={showFeedback} />
  else if (page === 'Announcements') content = <AnnouncementPage onAction={() => setActionOpen(true)} />
  else if (page === 'Job map') content = <JobMapPage onAction={() => showFeedback('Route optimized using current traffic and job windows.')} />
  else if (page === 'Check-in') content = <CheckInPage onAction={(message) => message ? showFeedback(message) : setActionOpen(true)} />
  else if (page === 'Directions') content = <DirectionsPage onAction={() => showFeedback('Navigation opened for Marina Bay Apartments.')} />
  else if (page === 'Guest services') content = <GuestServicesPage onAction={(message) => message ? showFeedback(message) : setActionOpen(true)} />
  else if (page === 'Request help') content = <HelpRequestPage onAction={(message) => message ? showFeedback(message) : setActionOpen(true)} />
  else if (page === 'Review stay') content = <ReviewStayPage onAction={(message) => message ? showFeedback(message) : setActionOpen(true)} />
  else if (page === 'BulkSMS') content = <BulkSMSPage onAction={(message) => message ? showFeedback(message) : setActionOpen(true)} />
  else content = <SettingsPage role={role} page={page} onAction={showFeedback} />

  return <>
    {feedback && <div className="dashboard-feedback"><Icon name="check" size={16} /> {feedback}</div>}
    {content}
    <GenericActionModal open={actionOpen} title={actionTitle} role={role} page={page} onClose={() => setActionOpen(false)} onDone={onDone} />
    <DetailModal open={Boolean(detail)} title={detail?.title ?? ''} meta={detail?.meta} onClose={() => setDetail(null)} />
  </>
}
