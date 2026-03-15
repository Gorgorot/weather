import {NgModule} from '@angular/core';
import {MapViewComponent} from './map-view.component';
import {MapWeatherCardComponent} from './components/map-weather-card/map-weather-card.component';
import {MatIcon} from '@angular/material/icon';
import {SearchComponent} from './components/search/search.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {
  MatActionList,
  MatDivider,
  MatList,
  MatListItem,
  MatListItemMeta,
  MatListOption,
  MatListSubheaderCssMatStyler,
  MatSelectionList
} from '@angular/material/list';
import {MapService} from './map.service';
import {MapDialogsService} from './map-dialogs.service';
import {AddPolygonModalComponent} from './components/modal/add-polygon-modal/add-polygon-modal.component';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {PolygonsListComponent} from './components/modal/polygons-list-component/polygons-list-component';
import {JsonPipe} from '@angular/common';
import {PolygonSettingsComponent} from './components/modal/polygon-settings-component/polygon-settings-component';
import {MatTree, MatTreeNode, MatTreeNodeDef, MatTreeNodePadding} from '@angular/material/tree';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatTooltip} from '@angular/material/tooltip';
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {RouterLink} from "@angular/router";

@NgModule({
  declarations: [
    MapViewComponent,
    MapWeatherCardComponent,
    SearchComponent,
    AddPolygonModalComponent,
    PolygonsListComponent,
    PolygonSettingsComponent,
  ],
  imports: [
    MatIcon,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatAutocomplete,
    MatOption,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatInput,
    MatList,
    MatListItem,
    MatListSubheaderCssMatStyler,
    FormsModule,
    MatButton,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSuffix,
    JsonPipe,
    MatActionList,
    MatListItemMeta,
    MatDialogTitle,
    MatDivider,
    MatTree,
    MatTreeNode,
    MatTreeNodeDef,
    MatTreeNodePadding,
    MatSelectionList,
    MatListOption,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatTooltip,
    MatSlideToggle,
    RouterLink,
  ],
  providers: [
    MapService,
    MapDialogsService,
  ],
  exports: [
    MapViewComponent,
    MapWeatherCardComponent,
  ]
})
export class MapViewModule {

}
