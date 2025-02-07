export abstract class BaseServicesSimple {
    abstract obtenerTodos(...args: unknown[]): Promise<unknown>;
    abstract obtenerPorId(clavePrimaria: unknown): Promise<unknown>;
}
