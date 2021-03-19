export const assert = (statement: any, message: string): void => {
	if (!statement) throw new Error(message)
}
