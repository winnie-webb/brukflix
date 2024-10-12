import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="w-[100vw] h-[70vh]">
        <Image
          className="w-full h-full object-cover"
          src={"/file.png"}
          width={1500}
          height={1500}
          alt="Movie Poster Official"
        ></Image>
      </div>
    </div>
  );
}
