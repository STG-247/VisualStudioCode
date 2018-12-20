import { SiteComponent } from './site.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { D3Component } from './d3/d3.component';
import { SiteRoutingModule } from './site.routing.module';

@NgModule({
  imports: [
    CommonModule,
    SiteRoutingModule
  ],
  declarations: [
    SiteComponent,
    HomeComponent,
    D3Component
  ]
})
export class SiteModule { }
