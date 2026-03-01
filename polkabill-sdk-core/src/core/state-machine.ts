import type { ILifecycle } from "./types";

export function createInitialState(): ILifecycle {
    return { status: "idle" }
}

export function transition(
    current: ILifecycle,
    next: Partial<ILifecycle>
): ILifecycle {
    return { ...current, ...next }
}