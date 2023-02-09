import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Product } from '../../models/product.model';
import { ProductsService } from './../../services/products.service';

@Component({
  selector: 'app-category',
  template:
    '<app-products [products]="products" (loadMore)="onLoadMore()"></app-products>',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categoryId: string | null = null;
  limit = 10;
  offset = 0;
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        //Para evitar callback hell de observables
        switchMap((params) => {
          this.categoryId = params.get('id');
          //Debo asegurarme que no sea null por la definición que tiene el método en el servicio
          if (this.categoryId) {
            //envío los productos
            return this.productsService.getByCategory(
              this.categoryId,
              this.limit,
              this.offset
            );
          }
          //envío array vacío si no hay productos ya que el operador espera un Observable
          return [];
        })
      )
      .subscribe((data) => {
        this.products = data;
      });
  }

  onLoadMore() {
    this.productsService.getAll(this.limit, this.offset).subscribe((data) => {
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  }
}
