import { DashboardShell } from "@/components/layout/DashboardShell";import { requireArea } from "@/server/auth/session";
export default async function Layout({children}:{children:React.ReactNode}){await requireArea("account");return <DashboardShell kind="buyer">{children}</DashboardShell>}
