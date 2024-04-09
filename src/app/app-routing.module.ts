import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstabelecComponent } from './components/estabelec/estabelec.component';

const routes: Routes = [
  {path: '', redirectTo: '/estabelec', pathMatch: 'full'},
  {path:'estabelec', component:EstabelecComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
