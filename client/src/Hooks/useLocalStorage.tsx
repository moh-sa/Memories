const useLocalStorage = () => {
  return {
    set: (name: string, data: unknown = "") => { localStorage.setItem(name, JSON.stringify(data)); },
    get: (name: string): unknown => {
      const item = localStorage.getItem(name);
      return item === null ? null : (JSON.parse(item) as unknown);
    },
    remove: (name: string) => { localStorage.removeItem(name); },
  };
};

export default useLocalStorage;
