import { Component, OnInit, OnDestroy } from '@angular/core';
import { combineLatest, debounceTime, distinctUntilChanged, first, map, startWith, Subject, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ChemicalElementsTable } from '../../components/chemical-elements-table/chemical-elements-table.component';
import { ChemicalElement } from '../../models/chemical-elements.model';
import { MatDialog } from '@angular/material/dialog';
import { ChemicalElementEditModalComponent } from '../../modals/chemical-element-edit-modal/chemical-element-edit-modal.component';
import { ChemicalElementFilterComponent } from '../../components/chemical-elements-filter/chemical-elements-filter.component';
import { ChemicalElementsService } from '../../services/chemical-elements.service';
import { rxState } from '@rx-angular/state';
import { filterChemicalElements } from 'src/utils/filter-chemical-elemnts.utils';
import { takeUntil } from 'rxjs/operators';

export interface DashboardState {
  chemicalElements: ChemicalElement[];
  filteredChemicalElements: ChemicalElement[];
  selectedChemicalElement: ChemicalElement | null;
  loading: boolean;
}

const INITIAL_STATE: DashboardState = {
  chemicalElements: [],
  filteredChemicalElements: [],
  selectedChemicalElement: null,
  loading: false,
};

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    AsyncPipe,
    ChemicalElementsTable,
    ChemicalElementEditModalComponent,
    ChemicalElementFilterComponent,
  ],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  readonly setChemicalElementsList$ = new Subject<ChemicalElement[]>();
  readonly chemicalElementsFilter$ = new Subject<string>();
  readonly editChemicalElement$ = new Subject<ChemicalElement>();
  readonly fetchedChemicalElementsTrigger$ = new Subject<void>();
  readonly saveChemicalElement$ = new Subject<ChemicalElement>();

  private readonly editChemicalElementHandler$ = this.editChemicalElement$.pipe(
    tap((chemicalElement) => this.openChemicalElementDialog(chemicalElement))
  );

  private readonly saveChemicalElementHandler$ = this.saveChemicalElement$.pipe(
    switchMap((element) => this.chemicalElementsService.updateChemicalElement(element)),
    tap(() => this.fetchedChemicalElementsTrigger$.next())
  );

  private readonly filterHandler$ = this.chemicalElementsFilter$.pipe(
    debounceTime(2000),
    distinctUntilChanged(),
    startWith('')
  );

  private readonly filteredChemicalElementsHandler$ = combineLatest([
    this.setChemicalElementsList$,
    this.filterHandler$,
  ]).pipe(
    map(([chemicalElements, filter]) => filterChemicalElements(chemicalElements, filter))
  );

  private readonly state = rxState<DashboardState>(({ set, connect }) => {
    set(INITIAL_STATE);
    connect('chemicalElements', this.setChemicalElementsList$);
    connect('selectedChemicalElement', this.saveChemicalElementHandler$, () => null);
    connect('selectedChemicalElement', this.editChemicalElementHandler$, (_, chemicalElement) => chemicalElement);
    connect('filteredChemicalElements', this.filteredChemicalElementsHandler$);
  });

  readonly filteredChemicalElements = this.state.signal('filteredChemicalElements');
  readonly loading = this.state.signal('loading');

  constructor(
    private readonly chemicalElementsService: ChemicalElementsService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscribeToFetchedChemicalElements();
    this.fetchedChemicalElementsTrigger$.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToFetchedChemicalElements(): void {
    this.fetchedChemicalElementsTrigger$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadChemicalElements());
  }

  private loadChemicalElements(): void {
    this.state.set({ loading: true });
    this.chemicalElementsService.getChemicalElements()
      .pipe(first())
      .subscribe({
        next: (chemicalElements) => {
          this.setChemicalElementsList$.next(chemicalElements);
          this.state.set({ loading: false });
        },
        error: (error) => {
          console.error('Error loading chemical elements:', error);
          this.state.set({ loading: false });
        }
      });
  }

  private openChemicalElementDialog(element: ChemicalElement): void {
    const dialogRef = this.dialog.open(ChemicalElementEditModalComponent, {
      data: { element },
    });

    dialogRef.afterClosed().subscribe((editedElement) => {
      if (editedElement) {
        this.saveChemicalElement$.next(editedElement);
      }
    });
  }
}
