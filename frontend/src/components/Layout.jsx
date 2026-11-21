import {NavLink, Outlet} from 'react-router-dom';
import {
    Activity,
    BarChart3,
    Clock,
    LayoutDashboard,
    Pencil,
    PoundSterling,
    TableProperties,
    Trash2,
    UserPlus,
} from 'lucide-react';

const NAV_ITEMS = [
    {to: '/', label: 'Overview', icon: LayoutDashboard, end: true},
    {to: '/add', label: 'Add', icon: UserPlus},
    {to: '/update', label: 'Update', icon: Pencil},
    {to: '/delete', label: 'Delete', icon: Trash2},
    {to: '/dept-stats', label: 'Dept Stats', icon: BarChart3},
    {to: '/long-stay', label: 'Long Stay', icon: Clock},
    {to: '/avg-cost', label: 'Avg Cost', icon: PoundSterling},
    {to: '/summary', label: 'Summary', icon: TableProperties},
];

export default function Layout() {
    return (
        <div className="app-shell">
            <aside className="sidebar">
                <NavLink to="/" className="brand">
          <span className="brand-mark">
            <Activity size={16} strokeWidth={2.5} aria-hidden="true"/>
          </span>
                    <span>MedTrack</span>
                </NavLink>

                <nav aria-label="Primary navigation" className="navigation">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({isActive}) =>
                                    `nav-link${isActive ? ' active' : ''}`
                                }
                            >
                                <Icon size={16} aria-hidden="true"/>
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <Outlet/>
            </main>
        </div>
    );
}
