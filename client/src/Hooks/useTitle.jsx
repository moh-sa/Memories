const useTitle = () => {
  return {
    setTitle: (title) => (document.title = `${title} - Memories`),
  };
};

export default useTitle;
