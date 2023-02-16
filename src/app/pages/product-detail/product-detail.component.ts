import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Product } from '../../models/product.model';
import { ProductsService } from './../../services/products.service';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  productId: string | null = null;
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        //Para evitar callback hell de observables
        switchMap((params) => {
          this.productId = params.get('id');
          //Debo asegurarme que no sea null por la definición que tiene el método en el servicio
          if (this.productId) {
            //envío los productos
            return this.productsService.getOne(this.productId);
          }
          //envío nullsi no hay producto ya que el operador espera un Observable
          return [null];
        })
      )
      .subscribe((data) => {
        console.log('data' + data);
        this.product = data;
      });
  }

  goToBack() {
    this.location.back();
  }
}
