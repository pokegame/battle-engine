export function timeout<T>(promise: Promise<T>, timeout: number, error: Error): Promise<T> {
  let timer: NodeJS.Timer | undefined;

  return Promise.race([
    promise,
    // tslint:disable:typedef
    new Promise((_, reject: (err: Error) => void) => timer = setTimeout(reject, timeout, error))
  ]).then((response: T) => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }

    return response;
  });
}
