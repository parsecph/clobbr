export enum ESearchSettingsMode {
  INPUT = 'Input', // Default mode. This will input settings for the search bar; it will show "Run" & "Done" as footer buttons.
  EDIT = 'Edit' // This functions as 'edit' for a result. It will show "Run" and "Cancel" as footer buttons.
}

export const SEARCH_SETTINGS_MODE = {
  INPUT: ESearchSettingsMode.INPUT,
  EDIT: ESearchSettingsMode.EDIT
};
