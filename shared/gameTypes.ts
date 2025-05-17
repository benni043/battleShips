export interface Cell {
    type: Type;
    id: number | undefined;
    color: string;
    x: number;
    y: number;
    originX: number;
    originY: number;
}

export interface Type {
    fieldType: FieldType,
    isHit: boolean
}

export interface Cord {
    x: number,
    y: number
}

export enum FieldType {
    SHIP,
    WATER
}