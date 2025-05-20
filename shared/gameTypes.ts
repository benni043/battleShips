export interface Cell {
    // type: Type;
    // id: number | undefined;
    // color: string;
    shipData: ShipData | undefined;
    isHit: boolean;
    x: number;
    y: number;
    originX: number;
    originY: number;
}

export interface ShipData {
    connectsTo: number;
    color: string;
}

// export interface Type {
//   fieldType: FieldType;
//   isHit: boolean;
// }

export interface Cord {
    x: number;
    y: number;
}

export interface HitResponse {
    cord: Cord;
    shipData: ShipData | undefined;
}

// export enum FieldType {
//   SHIP = "SHIP",
//   WATER = "WATER",
// }

export enum GameError {
    WRONG_PLAYER = "WRONG_PLAYER",
    INVALID_CORD = "INVALID_CORD",
    INVALID_ID = "INVALID_ID",
}
