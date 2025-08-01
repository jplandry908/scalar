export type Option = {
  id: string
  label: string
  isDeletable?: boolean
  [x: string]: any
}

export type OptionGroup = {
  label: string
  options: Option[]
}

/** Type guard to check if an option is a group */
export function isGroup(option: Option | OptionGroup | undefined): option is OptionGroup {
  return (option as OptionGroup | undefined)?.options !== undefined
}

/** Type guard to check if an array of options is an array of groups */
export function isGroups(options: Option[] | OptionGroup[]): options is OptionGroup[] {
  return isGroup(options[0])
}

/** Available slots for the combobox */
export type ComboboxSlots = {
  /** The reference element / trigger for the combobox */
  default(): unknown
  /** A slot for contents before the combobox options */
  before?(): unknown
  /** A slot for contents after the combobox options */
  after?(): unknown
}
