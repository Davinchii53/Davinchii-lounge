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

## Changelog

### v1.1.0 - The "Instant Response" Performance Polish
This update drastically eliminates perceived latency across both the Customer and Admin dashboards without compromising the security of Server Components or relying on less secure client-side fetching.

- **Session Panel Overhaul (Zero Latency Engagement):** 
  - Replaced native `useOptimistic` (which caused UI flickering and race conditions) with a robust local `useState` override in `app/dashboard/session-panel.tsx`.
  - Hitting "Engage" or "End Session" now snaps the UI shut instantly and starts the timer immediately from `00:00:00`, masking the ~2-second background server/database roundtrip.
  
- **F&B Panel Real-time Sync:** 
  - Lifted the `FnbPanel` rendering directly inside the `SessionPanel` so it shares the same instant optimistic state.
  - Clicking "Transmit Order" now instantly clears the cart and pushes the new order into the Active Requisitions list without any "pesky delays", all while the network request fires in the background.
  
- **Instant Admin Dashboard Navigation:** 
  - Addressed the ~1.95s freeze that occurs when navigating between Next.js Server Components (like clicking "Customers" from the sidebar).
  - Designed and implemented a stylized Cyberpunk "System Sync" `loading.tsx` layout. Clicking any sidebar link now provides instant, immersive visual feedback (rotating neon rings & cycling terminal text) while the database fetch resolves seamlessly in the background.
