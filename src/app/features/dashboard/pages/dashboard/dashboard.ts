import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { Header } from '../../components/header/header';
import { ItemsService } from '../../services/items';
import { Item } from '../../../../core/models/item.interface';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    Header
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  itemsList: Item[] = []
  suppliers = [
    { id: 1, name: 'Supplier A' },
    { id: 2, name: 'Supplier B' },
  ];

  displayedColumns = ['itemCode', 'itemName', 'qty', 'price', 'total', 'actions'];
  dataSource = signal<any[]>([]);
  invoiceForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private itemsService: ItemsService,
    private toaster: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.addRow();
    this.getItems();
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  getItems(){
    this.itemsService.getItems().subscribe({
      next:(data:Item[])=>{
        this.itemsList = data
      },
      error:(error:any)=>{
        this.toaster.error(error.error.message);
      }
    });
  }

  initForm(){
    this.invoiceForm = this.fb.group({
      header: this.fb.group({
        invoiceDate: ['', Validators.required],
        supplierId: ['', Validators.required],
        notes: [''],
      }),
      items: this.fb.array([], Validators.required),
    });
  }
  addRow() {
    if (this.items.length > 0) {
      const lastRow = this.items.at(this.items.length - 1);
      if (lastRow.invalid) {
        lastRow.markAllAsTouched();
        return;
      }
    }
    const row = this.fb.group({
      itemCode: ['', Validators.required],
      itemName: [{ value: '', disabled: true }],
      qty: [0, [Validators.required, Validators.min(1)]],
      price: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0.001)]],
      total: [{ value: 0, disabled: true }],
    });
    row.get('itemCode')?.valueChanges.subscribe(id => {
      const selected = this.itemsList.find((i:any) => i.id === id);
      if (selected) {
        const quantity = row.get('qty')?.value || 0
        row.patchValue({
          itemName: selected.title,
          price: selected.price,
          total: selected.price * quantity
        });
      }
    });
    row.get('qty')?.valueChanges.subscribe(() => this.updateRowTotal(row));
    row.get('price')?.valueChanges.subscribe(() => this.updateRowTotal(row));

    this.items.push(row);
    this.refreshTable()
  }

  removeRow(index: number) {
    this.items.removeAt(index);
    if (this.items.length === 0) this.addRow();
    this.refreshTable()
  }

  updateRowTotal(row: FormGroup) {
    const qty = row.get('qty')?.value || 0;
    const price = row.get('price')?.value || 0;
    row.patchValue({
      total: qty * price
    }, { emitEvent: false });
  }

  get grandTotal(): number {
    return this.items.controls.reduce((sum, row: any) => {
      return sum + (row.get('total')?.value || 0);
    }, 0);
  }

  refreshTable() {
    this.dataSource.set([...this.items.controls]);
  }

  printInvoice() {
  if (this.invoiceForm.invalid) {
    this.invoiceForm.markAllAsTouched();
    this.toaster.error('Please fix errors before printing');
    return;
  }

  window.print();
}
}

