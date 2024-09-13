import {Component} from '@angular/core';
import {DashboardPageStore, DashboardState} from "./dashboard-page.store";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {ChemicalElementsTable} from "../../components/chemical-elements-table/chemical-elements-table";
import {ChemicalElement} from "../../models/chemical-elements.model";
import {MatDialog} from "@angular/material/dialog";
import {ChemicalElementEditModalComponent} from "../../modals/chemical-element-edit-modal/chemical-element-edit-modal.component";

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    AsyncPipe,
    ChemicalElementsTable
  ],
  templateUrl: './dashboard-page.component.html',
  providers: [DashboardPageStore]
})
export class DashboardPageComponent {

  dashboardState$: Observable<DashboardState> = this.componentStore.state$;

  constructor(private componentStore: DashboardPageStore,
              private dialog: MatDialog) {

  }

  onEditElement(element: ChemicalElement): void {
    const dialogRef = this.dialog.open(ChemicalElementEditModalComponent, {
      data: {element}
    });

    dialogRef.afterClosed().subscribe(element => {
      if (element) {
        this.componentStore.editProduct$(element);
      }
    });
  }
}
