import { NavLink, Outlet } from 'react-router-dom';
import styles from './MainLayout.module.scss';

export function MainLayout() {
  function getLinkClass({ isActive }: { isActive: boolean }) {
    return [styles.navLink, isActive ? styles['navLink--active'] : ''].filter(Boolean).join(' ');
  }

  return (
    <div className={styles.layout}>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <span className={styles.brand}>Cuadre</span>
          <div className={styles.navLinks}>
            <NavLink to="/" end className={getLinkClass}>
              Mis gastos
            </NavLink>
            <NavLink to="/checklist" className={getLinkClass}>
              Checklist
            </NavLink>
          </div>
        </div>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
