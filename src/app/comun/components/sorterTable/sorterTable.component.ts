import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit } from '@angular/core';
import 'style-loader!./sorterTable.scss';

@Component({
    selector: 'sorter-table',
    templateUrl: './sorterTable.html'
})
export class SorterTableComponent implements OnInit {

    /**
     * NAME OF THIS SORT
     * @type {string}
     */
    @Input('by') sortBy: string = '';
    /**
     * CURRENT SORT NAME
     * @type {string}
     */
    _currentSort: string = '';
    /**
     * EVENTS WHEN IS CLICKED, SENDS [ASC|DESC]
     * @type {EventEmitter}
     */
    @Input('currentSort')
    set currentSort(value: string) {
        this._currentSort = value;
        this.isEqualToCurrent = this.sortBy === value;
    }

    get name() {
        return this._currentSort;
    }

    @Output() onSort: EventEmitter<{ order: string, by: string }> = new EventEmitter();

    isEqualToCurrent: boolean = false;
    sortOrder: boolean = false;

    constructor() {
    }

    ngOnInit() {
    }

    toogleSort() {
        this.sortOrder = !this.sortOrder;
        this.onSort.emit({ order: this.sortOrder ? 'asc' : 'desc', by: this.sortBy });
    }


}
