const useTitle = () => {
  return {
    setTitle: (title: string) => (document.title = `${title} - Memories`),
  };
};

export default useTitle;
