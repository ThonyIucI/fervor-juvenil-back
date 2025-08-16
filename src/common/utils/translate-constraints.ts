import { ValidationError } from 'class-validator'

function flattenErrors(errors: ValidationError[], parentPath = ''): string[] {
  const result: string[] = []
  for (const err of errors) {
    const propertyPath = parentPath ?
      `${parentPath}.${err.property}` :
      err.property
    if(err.constraints)
      for (const key of Object.keys(err.constraints))
        // ya en DTOs dejamos mensajes en español; aquí solo consolidamos
        result.push(`${propertyPath}: ${err.constraints[key]}`)

    if(err.children && err.children.length)
      result.push(...flattenErrors(err.children, propertyPath))
  }

  return result
}

export function translateValidationErrors(errors: ValidationError[]) {
  return flattenErrors(errors)
}
