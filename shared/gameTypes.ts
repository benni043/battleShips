export type Cell = {
    cell: WaterCell | ShipCell
}

export type WaterCell = {
    cord: Cord
}

export type ShipCell = {
    cord: Cord,
    shipId: number,
    isHit: boolean,
}

export type Cord = {
    x: number,
    y: number,
}
