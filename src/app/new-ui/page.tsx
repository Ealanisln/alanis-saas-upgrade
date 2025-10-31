"use client";

import React, { useState } from 'react';

const ModernUIExample = () => {
  const [activePage, setActivePage] = useState('dashboard');
  
  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-200 shadow-sm">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center font-bold">D</div>
            <span className="ml-3 font-semibold text-neutral-900">DevWorks</span>
          </div>
        </div>
        
        <nav className="p-4">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">Navegación</p>
          
          <NavItem 
            icon="grid" 
            label="Dashboard" 
            active={activePage === 'dashboard'} 
            onClick={() => setActivePage('dashboard')} 
          />
          <NavItem 
            icon="code" 
            label="Proyectos" 
            active={activePage === 'projects'} 
            onClick={() => setActivePage('projects')} 
          />
          <NavItem 
            icon="users" 
            label="Clientes" 
            active={activePage === 'clients'} 
            onClick={() => setActivePage('clients')} 
          />
          <NavItem 
            icon="bar-chart" 
            label="Analíticas" 
            active={activePage === 'analytics'} 
            onClick={() => setActivePage('analytics')} 
          />
          
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mt-6 mb-3">Configuración</p>
          
          <NavItem 
            icon="settings" 
            label="Ajustes" 
            active={activePage === 'settings'} 
            onClick={() => setActivePage('settings')} 
          />
          <NavItem 
            icon="help-circle" 
            label="Ayuda" 
            active={activePage === 'help'} 
            onClick={() => setActivePage('help')} 
          />
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-neutral-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>
            <div className="flex space-x-4 items-center">
              <button className="text-neutral-500 hover:text-neutral-700">
                <BellIcon />
              </button>
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-medium">JS</div>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Proyectos Activos" 
              value="12" 
              change="+2" 
              positive={true} 
              color="primary" 
            />
            <StatCard 
              title="Clientes Totales" 
              value="48" 
              change="+5" 
              positive={true} 
              color="info" 
            />
            <StatCard 
              title="Tareas Pendientes" 
              value="24" 
              change="-3" 
              positive={true} 
              color="warning" 
            />
            <StatCard 
              title="Ingresos Mensuales" 
              value="$12,450" 
              change="+8%" 
              positive={true} 
              color="success" 
            />
          </div>
          
          {/* Projects */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-neutral-900">Proyectos Recientes</h2>
              <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                Nuevo Proyecto
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
              <div className="grid grid-cols-12 px-6 py-3 border-b border-neutral-200 bg-neutral-50">
                <div className="col-span-5 font-medium text-neutral-500">Nombre</div>
                <div className="col-span-3 font-medium text-neutral-500">Cliente</div>
                <div className="col-span-2 font-medium text-neutral-500">Estado</div>
                <div className="col-span-2 font-medium text-neutral-500">Fecha</div>
              </div>
              
              <ProjectRow 
                name="Rediseño de Sitio Web" 
                client="TechCorp" 
                status="En Progreso" 
                statusColor="info" 
                date="12 Abr" 
              />
              <ProjectRow 
                name="App de Comercio" 
                client="ShopNow" 
                status="Completado" 
                statusColor="success" 
                date="5 Abr" 
              />
              <ProjectRow 
                name="Portal de Administración" 
                client="DataFirm" 
                status="En Revisión" 
                statusColor="warning" 
                date="28 Mar" 
              />
              <ProjectRow 
                name="Migración de API" 
                client="GlobalServices" 
                status="Pendiente" 
                statusColor="danger" 
                date="15 Mar" 
              />
            </div>
          </div>
          
          {/* Activity */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Actividad Reciente</h2>
            
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <ActivityItem 
                avatar="JS" 
                name="Juan Pérez" 
                action="completó la tarea" 
                target="Implementar autenticación" 
                time="hace 2 horas" 
              />
              <ActivityItem 
                avatar="AM" 
                name="Ana Martínez" 
                action="comentó en" 
                target="Rediseño de Sitio Web" 
                time="hace 4 horas" 
              />
              <ActivityItem 
                avatar="CL" 
                name="Carlos López" 
                action="inició" 
                target="Migración de Base de Datos" 
                time="ayer" 
              />
              <ActivityItem 
                avatar="MR" 
                name="María Rodríguez" 
                action="subió archivo a" 
                target="Documentación Técnica" 
                time="ayer" 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModernUIExample;

// Tipos de componentes auxiliares
interface NavItemProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  color: 'primary' | 'info' | 'warning' | 'success' | 'danger';
}

interface ProjectRowProps {
  name: string;
  client: string;
  status: string;
  statusColor: 'info' | 'success' | 'warning' | 'danger';
  date: string;
}

interface ActivityItemProps {
  avatar: string;
  name: string;
  action: string;
  target: string;
  time: string;
}

// Componentes auxiliares
const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button 
    className={`w-full flex items-center px-3 py-2 rounded-lg mb-1 ${
      active 
        ? 'bg-primary-50 text-primary-700' 
        : 'text-neutral-600 hover:bg-neutral-100'
    }`}
    onClick={onClick}
  >
    <span className={`mr-3 ${active ? 'text-primary-500' : 'text-neutral-400'}`}>
      {icon === 'grid' && <GridIcon />}
      {icon === 'code' && <CodeIcon />}
      {icon === 'users' && <UsersIcon />}
      {icon === 'bar-chart' && <BarChartIcon />}
      {icon === 'settings' && <SettingsIcon />}
      {icon === 'help-circle' && <HelpCircleIcon />}
    </span>
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ title, value, change, positive, color }: StatCardProps) => {
  const getBackgroundColor = () => {
    switch(color) {
      case 'primary': return 'bg-primary-50';
      case 'info': return 'bg-info-50';
      case 'warning': return 'bg-warning-50';
      case 'success': return 'bg-success-50';
      case 'danger': return 'bg-danger-50';
      default: return 'bg-primary-50';
    }
  };
  
  const getTextColor = () => {
    switch(color) {
      case 'primary': return 'text-primary-700';
      case 'info': return 'text-info-700';
      case 'warning': return 'text-warning-700';
      case 'success': return 'text-success-700';
      case 'danger': return 'text-danger-700';
      default: return 'text-primary-700';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-neutral-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-neutral-900 mt-1">{value}</h3>
        </div>
        <div className={`rounded-full h-10 w-10 flex items-center justify-center ${getBackgroundColor()}`}>
          <span className={getTextColor()}>
            <ChartIcon />
          </span>
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-xs font-medium rounded-full px-2 py-1 ${
          positive ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'
        }`}>
          {change}
        </span>
        <span className="text-xs text-neutral-500 ml-2">vs. mes anterior</span>
      </div>
    </div>
  );
};

const ProjectRow = ({ name, client, status, statusColor, date }: ProjectRowProps) => {
  const getStatusColor = () => {
    switch(statusColor) {
      case 'info': return 'bg-info-50 text-info-700';
      case 'success': return 'bg-success-50 text-success-700';
      case 'warning': return 'bg-warning-50 text-warning-700';
      case 'danger': return 'bg-danger-50 text-danger-700';
      default: return 'bg-neutral-50 text-neutral-700';
    }
  };
  
  return (
    <div className="grid grid-cols-12 px-6 py-4 border-b border-neutral-200 hover:bg-neutral-50">
      <div className="col-span-5 font-medium text-neutral-900">{name}</div>
      <div className="col-span-3 text-neutral-600">{client}</div>
      <div className="col-span-2">
        <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor()}`}>
          {status}
        </span>
      </div>
      <div className="col-span-2 text-neutral-500">{date}</div>
    </div>
  );
};

const ActivityItem = ({ avatar, name, action, target, time }: ActivityItemProps) => (
  <div className="flex items-start pb-4 mb-4 border-b border-neutral-200 last:border-0 last:mb-0 last:pb-0">
    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-medium mr-3">
      {avatar}
    </div>
    <div>
      <p className="text-neutral-800">
        <span className="font-medium">{name}</span>{' '}
        <span className="text-neutral-500">{action}</span>{' '}
        <span className="font-medium">{target}</span>
      </p>
      <p className="text-neutral-400 text-sm mt-1">{time}</p>
    </div>
  </div>
);

// Iconos simples
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" />
    <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" />
    <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" />
    <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" />
  </svg>
);

const CodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 3.13C17.7699 3.58317 19.0078 5.17799 19.0078 7.005C19.0078 8.83201 17.7699 10.4268 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 20V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HelpCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);