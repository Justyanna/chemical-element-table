import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { ChemicalElement } from '../models/chemical-elements.model';


@Injectable({
    providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
    createDb(): { elements: ChemicalElement[] } {
        const elements: ChemicalElement[] = [
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

        return { elements };
    }

    put(reqInfo: RequestInfo) {
        const updatedElement = reqInfo.utils.getJsonBody(reqInfo.req);
        const position = updatedElement.position;

        const index = reqInfo.collection.findIndex(
            (element: ChemicalElement) => element.position === position
        );

        if (index !== -1) {
            reqInfo.collection[index] = updatedElement;
        }

        return reqInfo.utils.createResponse$(() => ({
            status: index !== -1 ? 200 : 404,
            headers: reqInfo.headers,
            body: index !== -1 ? updatedElement : { error: 'Element not found' },
        }));
    }
}

