import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from './store';
import { Onboarding } from './pages/Onboarding';
import { ChildDashboard } from './pages/ChildDashboard';
import { ParentDashboard } from './pages/ParentDashboard';
import { Header } from './components/Header';

export default function App() {
  const { view } = useApp();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1F2937]">
      <Header />
      <AnimatePresence mode="wait">
        {view === 'onboarding' && (
          <motion.div key="onboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Onboarding />
          </motion.div>
        )}
        {view === 'child' && (
          <motion.div key="child" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <ChildDashboard />
          </motion.div>
        )}
        {view === 'parent' && (
          <motion.div key="parent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <ParentDashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
