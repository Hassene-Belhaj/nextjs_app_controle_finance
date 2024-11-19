import { SignUp } from "@clerk/nextjs";
const page = () => {
  return (
    <div className="min-h-screen w-full h-full flex justify-center items-center gap-4">
      <SignUp />
    </div>
  );
};

export default page;
