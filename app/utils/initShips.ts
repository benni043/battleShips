import type { Cell } from "#shared/gameTypes";

export function initNormal(grid: Cell[][]) {
  // 4x 1er
  grid[0]![0]!.shipData = { connectsTo: 1 };
  grid[0]![2]!.shipData = { connectsTo: 2 };
  grid[0]![4]!.shipData = { connectsTo: 3 };
  grid[0]![6]!.shipData = { connectsTo: 4 };

  // 3x 2er
  const ship2a = { connectsTo: 5 };
  grid[1]![0]!.shipData = ship2a;
  grid[1]![1]!.shipData = ship2a;

  const ship2b = { connectsTo: 6 };
  grid[1]![3]!.shipData = ship2b;
  grid[1]![4]!.shipData = ship2b;

  const ship2c = { connectsTo: 7 };
  grid[1]![6]!.shipData = ship2c;
  grid[1]![7]!.shipData = ship2c;

  // 2x 3er
  const ship3a = { connectsTo: 8 };
  grid[2]![0]!.shipData = ship3a;
  grid[2]![1]!.shipData = ship3a;
  grid[2]![2]!.shipData = ship3a;

  const ship3b = { connectsTo: 9 };
  grid[2]![4]!.shipData = ship3b;
  grid[2]![5]!.shipData = ship3b;
  grid[2]![6]!.shipData = ship3b;

  // 1x 4er
  const ship4 = { connectsTo: 10 };
  grid[3]![0]!.shipData = ship4;
  grid[3]![1]!.shipData = ship4;
  grid[3]![2]!.shipData = ship4;
  grid[3]![3]!.shipData = ship4;

  // 1x 5er
  const ship5 = { connectsTo: 11 };
  grid[4]![0]!.shipData = ship5;
  grid[4]![1]!.shipData = ship5;
  grid[4]![2]!.shipData = ship5;
  grid[4]![3]!.shipData = ship5;
  grid[4]![4]!.shipData = ship5;
}

export function initRussian(grid: Cell[][]) {
  grid[0]![0]!.shipData = { connectsTo: 1 };
  grid[0]![2]!.shipData = { connectsTo: 2 };
  grid[0]![4]!.shipData = { connectsTo: 3 };
  grid[0]![6]!.shipData = { connectsTo: 4 };

  const ship2a = { connectsTo: 5 };
  grid[1]![0]!.shipData = ship2a;
  grid[1]![1]!.shipData = ship2a;

  const ship2b = { connectsTo: 6 };
  grid[1]![3]!.shipData = ship2b;
  grid[1]![4]!.shipData = ship2b;

  const ship2c = { connectsTo: 7 };
  grid[1]![6]!.shipData = ship2c;
  grid[1]![7]!.shipData = ship2c;

  const ship3a = { connectsTo: 8 };
  grid[2]![0]!.shipData = ship3a;
  grid[3]![0]!.shipData = ship3a;
  grid[3]![1]!.shipData = ship3a;

  const ship3b = { connectsTo: 9 };
  grid[2]![3]!.shipData = ship3b;
  grid[3]![3]!.shipData = ship3b;
  grid[3]![4]!.shipData = ship3b;

  const ship4 = { connectsTo: 10 };
  grid[5]![1]!.shipData = ship4;
  grid[4]![1]!.shipData = ship4;
  grid[5]![0]!.shipData = ship4;
  grid[5]![2]!.shipData = ship4;

  const ship5 = { connectsTo: 11 };
  grid[7]![1]!.shipData = ship5;
  grid[6]![1]!.shipData = ship5;
  grid[8]![1]!.shipData = ship5;
  grid[7]![0]!.shipData = ship5;
  grid[7]![2]!.shipData = ship5;
}
