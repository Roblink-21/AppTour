import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyPlacesPage } from './my-places.page';

const routes: Routes = [
  {
    path: '',
    component: MyPlacesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPlacesPageRoutingModule {}
