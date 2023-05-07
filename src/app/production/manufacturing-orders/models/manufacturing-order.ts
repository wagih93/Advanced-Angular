export class ManufacturingOrder {
  constructor() {
    this.product = {} as Product;
    this.productionLine = {} as ProductionLine;
    this.team = {} as Team;
    this.owner = {} as Client;
  }
  id!: string;
  batchNumber!: number;
  quantity!: number;
  created!: string;
  product!: Product;
  productionLine!: ProductionLine;
  team!: Team;
  owner!: Client;
}

export class Product {
  id!: string;
  name!: string;
  description!: string;
  created!: string;
}

export class ProductionLine {
  id!: string;
  name!: string;
  description!: string;
  created!: string;
}
export class Team {
  id!: string;
  name!: string;
  number!: number;
  created!: string;
}
export class Client {
  id!: string;
  name!: string;
  created!: string;
}

export class FlatManufacturingOrder {
  Date!: any;
  Lot!: number;
  Produit!: string;
  Ligne!: string;
  Groupe!: string;
  Num_Groupe!: number;
  Objectif!: number;
  Propriétaire!: string;
}
