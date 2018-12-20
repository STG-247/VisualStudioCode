import { D3Component } from './d3/d3.component';
import { HomeComponent } from './home/home.component';
import { SiteComponent } from './site.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: SiteComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: 'home', component: HomeComponent},
      { path: 'd3', component: D3Component}
    ]
  }
];




@NgModule({
  imports: [
      RouterModule.forChild(routes)
  ],
  exports: [
      RouterModule
  ],
  providers: [
  ]
})
export class SiteRoutingModule { }
