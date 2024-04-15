import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { HomeComponent } from './home/home.component';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TableModule,
    PaginatorModule,
    InputTextModule
  ]
})
export class DashboardModule { }
