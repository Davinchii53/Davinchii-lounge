# Davinchii Lounge

A sleek, state-of-the-art gaming lounge management system built with Next.js and Supabase. Features a fully immersive **Cyberpunk Neon Glassmorphism** aesthetic, complete with a heavily optimized 3D WebGL background shader.

## Features

### Customer Experience
- **Sleek Cyberpunk UI:** Custom WebGL 3D fragment shaders and framer-motion animations provide a premium, immersive look.
- **Session Tracking:** Customers can view their active session time, pod assignment, and remaining balance.
- **Food & Beverage Ordering:** A fully integrated F&B ordering system with a dynamic cart and sliding side-panels.
- **Realtime Sync:** Live Supabase database subscriptions instantly update customer balances and order status across all screens without refreshing.

### Admin Dashboard
- **Lounge Control Center:** At-a-glance metrics for active pods, pending kitchen orders, and total revenue.
- **Pod Management:** View live status of all gaming pods across different zones. Admins can force close active sessions (which automatically deducts balance) or set pods to maintenance/idle.
- **Kitchen / Order Fulfillment:** Manage incoming F&B orders in real-time, updating order statuses from "Pending" to "Preparing" to "Completed".
- **Admin Access Control:** Manage lounge staff accounts securely, including the ability to provision and revoke admin access.

## Tech Stack
- **Framework:** Next.js 14+ (App Router, Turbopack)
- **Styling:** Tailwind CSS + Framer Motion
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Realtime Subscriptions)
- **3D Graphics:** Three.js (Optimized WebGL GLSL Fragment Shaders)

## Optimization Notes
The background 3D shader (`components/ui/shader-background.tsx`) has been manually optimized to maintain a high framerate on laptop GPUs (e.g., Radeon RX 5500M) by:
- Hard-capping the pixel ratio to `0.5`
- Imposing a strict `30 FPS` delta-time throttle
- Reducing `fbm` (Fractional Brownian Motion) iterations to minimize compute load.
