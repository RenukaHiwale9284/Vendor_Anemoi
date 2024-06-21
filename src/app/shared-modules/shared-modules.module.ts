import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ButtonModule} from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {DialogModule} from 'primeng/dialog';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {InputSwitchModule} from 'primeng/inputswitch';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import { RouterModule } from '@angular/router';
// import { HeadersRoutingModule } from '../Components/headers/headers-routing.module';
import {DividerModule} from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {DropdownModule} from 'primeng/dropdown';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import {EditorModule} from 'primeng/editor';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DataViewModule} from 'primeng/dataview';
import {KnobModule} from 'primeng/knob';
import {StepsModule} from 'primeng/steps';
import {TabMenuModule} from 'primeng/tabmenu';
import {CheckboxModule} from 'primeng/checkbox';
import {MultiSelectModule} from 'primeng/multiselect';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {TreeTableModule} from 'primeng/treetable';
import {TreeSelectModule} from 'primeng/treeselect';
import {MenuModule} from 'primeng/menu';
import {SplitButtonModule} from 'primeng/splitbutton';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {BadgeModule} from 'primeng/badge';
import {ListboxModule} from 'primeng/listbox';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {PickListModule} from 'primeng/picklist';
import { PanelModule } from 'primeng/panel';
import { PaginatorModule } from 'primeng/paginator';
import { PowerBIEmbedModule } from 'powerbi-client-angular';

//Angular material
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  declarations: [],
  imports: [
    TreeSelectModule,
    CommonModule,
    RouterModule,
    // HeadersRoutingModule,
    ButtonModule,
    ToolbarModule,
    FileUploadModule,
    HttpClientModule,
    CardModule,
    DialogModule,
    InputTextModule,
    TableModule,
    InputSwitchModule,
    TabViewModule,
    DividerModule,
    FormsModule,
    ReactiveFormsModule,
    CascadeSelectModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    EditorModule,
    InputTextareaModule,
    DataViewModule,
    KnobModule,
    StepsModule,
    TabMenuModule,
    CheckboxModule,
    RadioButtonModule,
    MultiSelectModule,
    ToggleButtonModule,
    TreeTableModule,
    MenuModule,
    MatMenuModule,
    MatIconModule,
    SplitButtonModule,
    MatSelectModule,
    MatButtonModule,
    ListboxModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    PickListModule,
    PanelModule,
    PowerBIEmbedModule,
    PaginatorModule
  ],
  exports:[
    TreeSelectModule,
    CommonModule,
    RouterModule,
    // HeadersRoutingModule,
    ButtonModule,
    ToolbarModule,
    FileUploadModule,
    HttpClientModule,
    CardModule,
    DialogModule,
    InputTextModule,
    TableModule,
    InputSwitchModule,
    TabViewModule,
    DividerModule,
    FormsModule,
    ReactiveFormsModule,
    CascadeSelectModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    EditorModule,
    InputTextareaModule,
    DataViewModule,
    KnobModule,
    StepsModule,
    TabMenuModule,
    CheckboxModule,
    RadioButtonModule,
    MultiSelectModule,
    ToggleButtonModule,
    TreeTableModule,
    MenuModule,
    MatMenuModule,
    MatIconModule,
    SplitButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    OverlayPanelModule,
    BadgeModule,
    ListboxModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    PickListModule,
    PanelModule,
    PowerBIEmbedModule,
    PaginatorModule
  ]
})
export class SharedModulesModule { }
