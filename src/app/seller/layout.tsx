import { DashboardShell } from "@/components/layout/DashboardShell";import { requireArea } from "@/server/auth/session";
export default async function Layout({children}:{children:React.ReactNode}){await requireArea("seller");return <DashboardShell kind="seller">{children}</DashboardShell>}
