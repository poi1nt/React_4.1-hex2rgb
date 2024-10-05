export interface IConverterState {
  hex: string,
  rgb: string,
  error: string,
}

export interface IHexValidationResult {
  isValid: boolean,
  rgb: string | null,
}
