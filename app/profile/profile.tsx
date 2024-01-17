import Image from "next/image";
import Link from "next/link";

export default async function profile({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) {
  return (
    <div className="flex justify-between">
      <div>
        <h2 className="text-3xl font-semibold">{user.name}</h2>
        <div>{user.email}</div>
      </div>
      <Link href={user.image || ""}>
        <div className="relative h-20 w-20 overflow-hidden rounded-full">
          <Image
            className="object-cover"
            src={user.image || ""}
            alt={user.name || ""}
            quality={100}
            priority={true}
            fill={true}
          />
        </div>
      </Link>
    </div>
  );
}
