import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'WhiteBlue | Deep tech underneath your AI' },
  {
    path: 'services/agentic-ai',
    loadComponent: () => import('./pages/agentic-ai/agentic-ai-page.component').then(m => m.AgenticAiPageComponent),
    title: 'Agentic AI services | WhiteBlue',
  },
  {
    path: 'services/infra-automation',
    loadComponent: () => import('./pages/infra-automation/infra-automation-page.component').then(m => m.InfraAutomationPageComponent),
    title: 'Infra automation services | WhiteBlue',
  },
  {
    path: 'services/data-modernization',
    loadComponent: () => import('./pages/data-modernization/data-modernization-page.component').then(m => m.DataModernizationPageComponent),
    title: 'Data modernization services | WhiteBlue',
  },
  {
    path: 'services/api-services',
    loadComponent: () => import('./pages/api-services/api-services-page.component').then(m => m.ApiServicesPageComponent),
    title: 'API services | WhiteBlue',
  },
  {
    path: 'products/insureliv',
    loadComponent: () => import('./pages/insureliv/insureliv-page.component').then(m => m.InsureLivPageComponent),
    title: 'InsureLiv, AI platform for insurance brokers | WhiteBlue',
  },
  {
    path: 'products/dobby',
    loadComponent: () => import('./pages/dobby/dobby-page.component').then(m => m.DobbyPageComponent),
    title: 'Dobby, AI agent for Slack and Microsoft Teams | WhiteBlue',
  },
  {
    path: 'products/quickqode',
    loadComponent: () => import('./pages/quickqode/quickqode-page.component').then(m => m.QuickQodePageComponent),
    title: 'QuickQode, AI code generation | WhiteBlue',
  },
  {
    path: 'products/fieldzapp',
    loadComponent: () => import('./pages/fieldzapp/fieldzapp-page.component').then(m => m.FieldZappPageComponent),
    title: 'FieldZapp, AI field service app | WhiteBlue',
  },
  {
    path: 'company/purpose-leadership',
    loadComponent: () => import('./pages/company/purpose-leadership-page.component').then(m => m.PurposeLeadershipPageComponent),
    title: 'Purpose & leadership | WhiteBlue',
  },
  {
    path: 'company/framework',
    loadComponent: () => import('./pages/company/framework-page.component').then(m => m.FrameworkPageComponent),
    title: 'The WhiteBlue framework | AI automation every 90 days',
  },
  {
    path: 'company/social-initiative',
    loadComponent: () => import('./pages/company/social-initiative-page.component').then(m => m.SocialInitiativePageComponent),
    title: 'Social initiative, Sai Sankalp School | WhiteBlue',
  },
  {
    path: 'company/global-presence',
    loadComponent: () => import('./pages/company/global-presence-page.component').then(m => m.GlobalPresencePageComponent),
    title: 'Global presence: India, UAE and USA | WhiteBlue',
  },
  { path: '**', redirectTo: '' },
];
