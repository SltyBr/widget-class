export enum OutputEvent {
  Init = 'ptnl.output.init',
  Ready = 'ptnl.output.ready',
  SetFilter = 'ptnl.output.setFilter',
  RemoveFilterAt = 'ptnl.output.RemoveFilterAt',
  SetSort = 'ptnl.output.setSort',
  RemoveSortAt = 'ptnl.output.RemoveSortAt',
  Interact = 'ptnl.output.interact',
}

export enum InputEvent {
  Change = 'ptnl.input.change',
  ChangeLang = 'ptnl.input.changeLang',
  ChangeTheme = 'ptnl.input.changeTheme',
  ChangeOtherFilters = 'ptnl.input.ChangeOtherFilters',
  ChangeWidgetRenderEnv = 'ptnl.input.changeWidgetRenderEnv',
}
