import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { OffSidebarComponent } from './off-sidebar/off-sidebar.component';



@NgModule({
  declarations: [HeaderComponent, FooterComponent, SidebarComponent, OffSidebarComponent],
  imports: [
    CommonModule
  ]
})
export class LayoutModule { }
