import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ChemicalElement } from "../models/chemical-elements.model";

const CHEMICAL_ELEMENTS_URL = 'api/elements';

@Injectable({
    providedIn: 'root'
})
export class ChemicalElementsService {

    private readonly http = inject(HttpClient);
    private readonly httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    getChemicalElements(): Observable<ChemicalElement[]> {
        return this.http.get<ChemicalElement[]>(CHEMICAL_ELEMENTS_URL);
    }

    updateChemicalElement(element: ChemicalElement): Observable<any> {
        return this.http.put(CHEMICAL_ELEMENTS_URL + '/' + element.position, element, this.httpOptions);
    }

}
