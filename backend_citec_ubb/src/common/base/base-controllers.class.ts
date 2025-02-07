export abstract class BaseControllers {
    abstract crear(...args: unknown[]): unknown;
    abstract obtenerTodos(...args: unknown[]): unknown;
    obtenerTodosEliminados?(...args: unknown[]): unknown;
    abstract obtenerPorId(clavePrimaria: unknown): unknown;
    abstract actualizar(...args: unknown[]): unknown;
    abstract eliminar(clavePrimaria: unknown): unknown;
}
