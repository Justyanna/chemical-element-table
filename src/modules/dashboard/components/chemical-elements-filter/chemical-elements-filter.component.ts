import { Component, ChangeDetectionStrategy, output, Output, EventEmitter } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
    selector: 'app-chemical-elements-filter',
    standalone: true,
    templateUrl: './chemical-elements-filter.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatFormFieldModule, MatInputModule]
})
export class ChemicalElementFilterComponent{
    @Output() filter = new EventEmitter<string>();

    onInput(event: Event): void {
        this.filter.emit((event.target as HTMLInputElement).value);
    }
}
