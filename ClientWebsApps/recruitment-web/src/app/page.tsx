import { auth } from '@/lib/auth';
import { LandingPage } from '@/components/home/LandingPage';

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = !!session;
  const userRole = session?.user?.role;

  return <LandingPage isLoggedIn={isLoggedIn} userRole={userRole} />;
}
