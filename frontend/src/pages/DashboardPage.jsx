import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';
import DashboardTabs from '../components/dashboard/DashboardTabs';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <Layout title="Dashboard">
      <DashboardTabs />
    </Layout>
  );
};

export default DashboardPage;