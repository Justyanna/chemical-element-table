import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ChemicalElement } from "../models/chemical-elements.model";

const ELEMENT_DATA: ChemicalElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];


@Injectable({
    providedIn: 'root'
})
export class ChemicalElementsService {

    constructor(private http: HttpClient) {
    }

    getChemicalElements(): Observable<ChemicalElement[]> {
        return of(ELEMENT_DATA).pipe(delay(1000));
    }

    updateElement(element: ChemicalElement, index: number) {
        if (index >= 0 && index < ELEMENT_DATA.length) {
            ELEMENT_DATA[index] = element;
        }
        return of(200).pipe(delay(1000));
    }

}
