import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChemicalElement } from "../../models/chemical-elements.model";
import { MatFabButton, MatIconButton, MatMiniFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";


@Component({
  selector: 'app-chemical-elements-table',
  templateUrl: 'chemical-elements-table.component.html',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatFabButton, MatMiniFabButton, MatIconButton, MatIcon],
})
export class ChemicalElementsTableComponent {


  @Input() displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'edit'];
  @Input() set chemicalElements(chemicalElements: ChemicalElement[]) {
    if (this.dataSource) {
      this.dataSource.data = chemicalElements;
    } else {
      this.dataSource = new MatTableDataSource(chemicalElements);
    }
  }

  @Output() editElementEvent = new EventEmitter<ChemicalElement>();
  @Output() filter = new EventEmitter<string>;

  dataSource: MatTableDataSource<ChemicalElement> = new MatTableDataSource;

  editElement(element: ChemicalElement): void {
    this.editElementEvent.emit(element);
  }
}
