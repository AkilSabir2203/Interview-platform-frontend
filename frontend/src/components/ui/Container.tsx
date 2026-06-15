interface ContainerProps {
   children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="w-full mx-auto xl:px-12 md:px-10 sm:px-2 px-4">
      {children}
    </div>
  );
};

export default Container;