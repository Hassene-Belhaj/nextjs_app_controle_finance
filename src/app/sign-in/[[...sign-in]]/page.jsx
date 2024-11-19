import { SignIn } from "@clerk/nextjs";
const page = () => {
  return (
    <div className="min-h-screen w-full h-full flex justify-center items-center gap-4">
      <SignIn />
    </div>
  );
};

export default page;
