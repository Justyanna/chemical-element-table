import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ChemicalElement} from "../../models/chemical-elements.model";
import {debounceTime, Subject} from "rxjs";
import {MatFabButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";


@Component({
  selector: 'chemical-elements-table',
  templateUrl: 'chemical-elements-table.html',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatFabButton, MatMiniFabButton, MatIconButton, MatIcon],
})
export class ChemicalElementsTable implements OnInit {

  @Input() displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'edit'];
  @Input() set chemicalElements(chemicalElements: ChemicalElement[]) {
    if (this.dataSource) {
      this.dataSource.data = chemicalElements;
    } else {
      this.dataSource = new MatTableDataSource(chemicalElements);
    }
  }

  @Output() editElementEvent = new EventEmitter<{element: ChemicalElement, index: number}>();

  dataSource: MatTableDataSource<ChemicalElement>;
  private filterSubject = new Subject<string>();

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterSubject.next(filterValue);
  }

  ngOnInit(): void {
    this.filterSubject.pipe(debounceTime(2000)).subscribe((filterValue) => {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    });

    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      const dataStr = `${data.position} ${data.name} ${data.weight} ${data.symbol}`.toLowerCase();
      return dataStr.includes(filter);
    };
  }

  editElement(element: ChemicalElement, index: number): void {
    this.editElementEvent.emit({element, index });
  }
}
