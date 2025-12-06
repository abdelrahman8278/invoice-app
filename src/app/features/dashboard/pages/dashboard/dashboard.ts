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

  suppliers = [
    { id: 1, name: 'Supplier A' },
    { id: 2, name: 'Supplier B' },
  ];

  itemsList = [
    { code: 'ITM001', name: 'Item Alpha', price: 60 },
    { code: 'ITM002', name: 'Item Beta', price: 80 },
    { code: 'ITM003', name: 'Item Gamma', price: 100 },
  ];

  displayedColumns = ['itemCode', 'itemName', 'qty', 'price', 'total', 'actions'];
  dataSource = signal<any[]>([]);
  invoiceForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.invoiceForm = this.fb.group({
      header: this.fb.group({
        invoiceDate: ['', Validators.required],
        supplierId: ['', Validators.required],
        notes: [''],
      }),
      items: this.fb.array([], Validators.required),
    });

    this.addRow();
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
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
    console.log('row=====>',row)
    row.get('itemCode')?.valueChanges.subscribe(code => {
      const selected = this.itemsList.find(i => i.code === code);
      if (selected) {
        const quantity = row.get('qty')?.value || 0
        row.patchValue({
          itemName: selected.name,
          price: selected.price,
          total: selected.price * quantity
        });
        console.log('selected=====>',selected)
      }
    });
    row.get('qty')?.valueChanges.subscribe(() => this.updateRowTotal(row));
    row.get('price')?.valueChanges.subscribe(() => this.updateRowTotal(row));
    console.log('00000000000=====>')

    this.items.push(row);
    this.refreshTable()
    console.log('items=====>',this.items.value)
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
    alert("Please fix errors before printing.");
    return;
  }

  window.print();
}
}

