export const assert = (statement: any, message: string) => {
    if (!statement) throw new Error(message)
}