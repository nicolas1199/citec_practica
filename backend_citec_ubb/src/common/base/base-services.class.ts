export abstract class BaseServices {
    abstract crear(...args: unknown[]): Promise<unknown>;
    abstract obtenerTodos(...args: unknown[]): Promise<unknown>;
    obtenerTodosEliminados?(...args: unknown[]): Promise<unknown>;
    abstract obtenerPorId(clavePrimaria: unknown): Promise<unknown>;
    abstract actualizar(...args: unknown[]): Promise<unknown>;
    abstract eliminar(clavePrimaria: unknown): Promise<unknown>;
}
