export interface ProductDEMO {

    id: number;

    category: Category[];

}

export interface Category {

    name: string;

    weightage: number;

    subcategory: Subcategory[];

}

export interface Subcategory {

    subcategoryname?: any;

    weightage?: number;

    parameter?: Parameter[];

}

export interface Parameter {

    parametername?: string;

    weightage?: number;

    maxschore?: number;

    schoringcriteria?: string;

}