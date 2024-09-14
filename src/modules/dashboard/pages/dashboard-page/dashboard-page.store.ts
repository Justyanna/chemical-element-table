import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { exhaustMap, finalize, Observable, tap } from 'rxjs';
import { ChemicalElementsService } from "../../services/chemical-elements.service";
import { ChemicalElement } from "../../models/chemical-elements.model";
import { tapResponse } from "@ngrx/operators";

export interface DashboardState {
    chemicalElements: ChemicalElement[];
    loading: boolean;
}

const initialState: DashboardState = {
    chemicalElements: [],
    loading: false,
};

@Injectable()
export class DashboardPageStore extends ComponentStore<DashboardState> {

    constructor(private chemicalElementsService: ChemicalElementsService) {
        super(initialState);
        this.loadChemicalElements$();
    }

    readonly loadChemicalElements$ = this.effect(
        (trigger$: Observable<void>) => trigger$.pipe(
            tap(() => this.setLoading(true)),
            exhaustMap(() => this.chemicalElementsService.getChemicalElements().pipe(
                tapResponse(data => this.setChemicalElements(data),
                    (error) => console.error(error)),
                finalize(() => this.setLoading(false))
            )))
    );

    readonly editProduct$ = this.effect(
        (params$: Observable<{ element: ChemicalElement, index: number }>) => params$.pipe(
            exhaustMap((params: { element: ChemicalElement, index: number }) => this.chemicalElementsService.updateElement(params.element, params.index).pipe(
                tapResponse(() => {
                    console.info(`Successfully edit of product ${params.element.position} ${params.element.name} ${params.element.symbol} ${params.element.weight}`)
                }, (error) => console.error(error)),
                finalize(() => {
                    this.loadChemicalElements$();
                })
            )))
    );

    private readonly setLoading = this.updater((state, loading: boolean) => ({
        ...state,
        loading
    }));

    private readonly setChemicalElements = this.updater((state, chemicalElements: ChemicalElement[]) => ({
        ...state,
        chemicalElements
    }));

}
