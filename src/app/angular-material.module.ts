import { NgModule } from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

/**
 * ngmodule consists of two fields: import and export array.
 * The import array consists of all the modules your code may need.
 * Export array, on the other hand, is a copy of import array.
 *
 * In angular, You can have an export array and angular will automatically generate a duplicate import array based off the export array.
 */
@NgModule({
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatPaginatorModule,
  ],
})
export class AngularMaterialModule {}
