interface AvatarProps {
  src: string | null | undefined;
};

const Avatar: React.FC<AvatarProps> = ({
  src
}) => {
  return (
  <img
    className="rounded-full object-cover"
    height="30"
    width="30"
    alt="Avatar"
    src={src || "/images/placeholder.jpg"}
  />
  )
}

export default Avatar;