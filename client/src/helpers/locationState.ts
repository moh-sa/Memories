export interface LoginLocationState {
  form?: { pathname?: string };
  isRegister?: boolean;
  message: string;
}

export interface MissingLocationState {
  code?: number;
  msg?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getLoginLocationState(
  state: unknown,
): LoginLocationState | null {
  if (!isRecord(state)) {
    return null;
  }

  const form = isRecord(state.form)
    ? { pathname: typeof state.form.pathname === "string" ? state.form.pathname : undefined }
    : undefined;

  return {
    form,
    isRegister: state.isRegister === true,
    message: typeof state.message === "string" ? state.message : "",
  };
}

export function getMissingLocationState(
  state: unknown,
): MissingLocationState | null {
  if (!isRecord(state)) {
    return null;
  }

  return {
    code: typeof state.code === "number" ? state.code : undefined,
    msg: typeof state.msg === "string" ? state.msg : undefined,
  };
}
