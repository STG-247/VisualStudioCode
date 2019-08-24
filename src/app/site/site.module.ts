import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SiteComponent } from './site.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { D3Component } from './d3/d3.component';
import { SiteRoutingModule } from './site.routing.module';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { OffSidebarComponent } from './layout/off-sidebar/off-sidebar.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    SiteRoutingModule
  ],
  declarations: [
    SiteComponent,
    HomeComponent,
    D3Component,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    OffSidebarComponent,
    LoginComponent
  ]
})
export class SiteModule { }
