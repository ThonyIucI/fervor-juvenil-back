/**
 * Base class for all custom domain errors
 * Provides consistent error structure across the application
 */
export class CustomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}
