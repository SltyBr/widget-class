export enum DataQueryMethod {
  Table = 'table',
  Aggregate = 'aggregate',
}

export enum ConfigDataBlockType_Server {
  Column = 'column',
  Filter = 'filter',
  Sort = 'sort',
  Colorizer = 'colorizer',
  Drilldown = 'drilldown',
}

export enum DataQueryFunction {
  Group = 'group',
  Sum = 'sum',
  Average = 'avg',
  Min = 'min',
  Max = 'max',
  First = 'first',
  Last = 'last',
}

export enum ColumnType {
  String = 'string',
  Number = 'number',
  Date = 'date',
  Array = 'array',
  Object = 'object',
  Boolean = 'boolean',
}
