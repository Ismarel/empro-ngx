## HOW TO USE IT
<tr>
  <th> <sorter-table by='fecha_fin' [currentSort]="sortBy" (onSort)="onSort($event)">Fecha de Final</sorter-table></th>
  ...

  onSort(event: { order: string, by: string }) {
      this.sortBy = event.by;
      this.sortOrder = event.order;
      console.log(event);
   }
