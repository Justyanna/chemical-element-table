import { ChemicalElement } from "src/modules/dashboard/models/chemical-elements.model";

export function filterChemicalElements(chemicalElements: ChemicalElement[], filter: string): ChemicalElement[] {
    return chemicalElements.filter((chemicalElement: ChemicalElement) =>
        `${chemicalElement.position} ${chemicalElement.name} ${chemicalElement.weight} ${chemicalElement.symbol}`.toLowerCase().includes(filter.toLowerCase())
    );
}
