import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'SupplierClarity AI | Catalog-ready images from every supplier' },
  {
    path: 'enhance',
    loadComponent: () => import('./pages/enhance/enhance-page.component').then(m => m.EnhancePageComponent),
    title: 'Clarity Upscaler — make supplier images catalog-ready | SupplierClarity AI',
  },
  {
    path: 'services/agentic-qa',
    loadComponent: () => import('./pages/agentic-ai/agentic-ai-page.component').then(m => m.AgenticAiPageComponent),
    title: 'Agentic QA services | SupplierClarity AI',
  },
  {
    path: 'services/workflow-automation',
    loadComponent: () => import('./pages/infra-automation/infra-automation-page.component').then(m => m.InfraAutomationPageComponent),
    title: 'Workflow automation services | SupplierClarity AI',
  },
  {
    path: 'services/catalog-data',
    loadComponent: () => import('./pages/data-modernization/data-modernization-page.component').then(m => m.DataModernizationPageComponent),
    title: 'Catalog data modernization | SupplierClarity AI',
  },
  {
    path: 'services/image-apis',
    loadComponent: () => import('./pages/api-services/api-services-page.component').then(m => m.ApiServicesPageComponent),
    title: 'Image APIs | SupplierClarity AI',
  },
  {
    path: 'products/batchforge',
    loadComponent: () => import('./pages/dobby/dobby-page.component').then(m => m.DobbyPageComponent),
    title: 'BatchForge, bulk catalog processing | SupplierClarity AI',
  },
  {
    path: 'products/pim-connect',
    loadComponent: () => import('./pages/quickqode/quickqode-page.component').then(m => m.QuickQodePageComponent),
    title: 'PIM Connect, sync imagery everywhere | SupplierClarity AI',
  },
  {
    path: 'products/complycheck',
    loadComponent: () => import('./pages/fieldzapp/fieldzapp-page.component').then(m => m.FieldZappPageComponent),
    title: 'ComplyCheck, marketplace compliance checks | SupplierClarity AI',
  },
  {
    path: 'company/purpose-leadership',
    loadComponent: () => import('./pages/company/purpose-leadership-page.component').then(m => m.PurposeLeadershipPageComponent),
    title: 'Purpose & leadership | SupplierClarity AI',
  },
  {
    path: 'company/framework',
    loadComponent: () => import('./pages/company/framework-page.component').then(m => m.FrameworkPageComponent),
    title: 'The Clarity framework | SupplierClarity AI',
  },
  {
    path: 'company/social-initiative',
    loadComponent: () => import('./pages/company/social-initiative-page.component').then(m => m.SocialInitiativePageComponent),
    title: 'Clarity for Good | SupplierClarity AI',
  },
  {
    path: 'company/global-presence',
    loadComponent: () => import('./pages/company/global-presence-page.component').then(m => m.GlobalPresencePageComponent),
    title: 'Global presence | SupplierClarity AI',
  },
  { path: '**', redirectTo: '' },
];
